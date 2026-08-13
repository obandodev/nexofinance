def validate_credentials(email: str, password: str):
    if not email or not password:
        raise ValueError('Correo y contraseña son obligatorios')
