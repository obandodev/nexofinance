import secrets
import string

from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

def generate_recovery_code():
    alphabet = string.ascii_uppercase + string.digits
    part1 = "".join(secrets.choice(alphabet) for _ in range(4))
    part2 = "".join(secrets.choice(alphabet) for _ in range(4))
    part3 = "".join(secrets.choice(alphabet) for _ in range(4))
    return f"NEXO-{part1}-{part2}-{part3}"

def hash_recovery_code(code):
    return pwd_context.hash(code)

def verify_recovery_code(code, hashed_code):
    return pwd_context.verify(code, hashed_code)