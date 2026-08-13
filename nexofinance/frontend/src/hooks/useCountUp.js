import { useEffect, useState } from "react";

// Anima un numero desde 0 hasta el valor final, con easing suave.
// No sabe nada de dinero ni de UI: solo entrega un numero que va cambiando.
export function useCountUp(target, durationMs = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = null;
    let frameId;

    function step(timestamp) {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(target * eased);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    }

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, durationMs]);

  return value;
}
