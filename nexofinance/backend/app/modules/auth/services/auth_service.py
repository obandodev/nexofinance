from fastapi import HTTPException, status
from app.modules.auth.models.user import User
from app.modules.auth.repositories.repository import get_by_email
from app.auth.security import hash_password, verify_password, create_access_token
from app.utils.recovery_code import generate_recovery_code, hash_recovery_code, verify_recovery_code

def signup(db, data):
    if get_by_email(db, data.email):
        raise HTTPException(status_code=400, detail="Ya existe una cuenta con ese correo.")
    recovery_code = generate_recovery_code()
    user = User(email=data.email, full_name=data.full_name,
                hashed_password=hash_password(data.password),
                recovery_code_hash=hash_recovery_code(recovery_code))
    db.add(user); db.commit(); db.refresh(user)
    return {"access_token": create_access_token({"user_id": user.id}), "token_type": "bearer", "user": user, "recovery_code": recovery_code}

def login(db, credentials):
    user = get_by_email(db, credentials.email)
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Correo o contraseña incorrectos.")
    return {"access_token": create_access_token({"user_id": user.id}), "user": user}

def recover_password(db, data):
    user = get_by_email(db, data.email)
    if not user: raise HTTPException(status_code=404, detail="No existe una cuenta con ese correo.")
    if not verify_recovery_code(data.recovery_code, user.recovery_code_hash):
        raise HTTPException(status_code=400, detail="El código de recuperación es incorrecto.")
    user.hashed_password = hash_password(data.new_password); db.commit()
    return {"message": "Contraseña actualizada correctamente."}
