from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from dotenv import load_dotenv

import os

# Cargar las variables de entorno
load_dotenv()

# Obtener SECRET_KEY desde el .env, con manejo de error
SECRET_KEY = os.getenv("SECRET_KEY")

# Si SECRET_KEY no está presente, lanzar una excepción
if SECRET_KEY is None:
    raise ValueError("SECRET_KEY is not set in the environment variables or .env file")

# Crear contexto de Argon2 para el cifrado de contraseñas
pwd_context = CryptContext(
    schemes=["argon2"],  # Cambiar de "bcrypt" a "argon2"
    argon2__time_cost=2,  # Ajusta el tiempo de costumbre según sea necesario
    argon2__memory_cost=102400,  # Ajusta el costo de memoria
    argon2__parallelism=8,  # Ajusta el nivel de paralelismo
    deprecated="auto"
)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Función para verificar la contraseña
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Configuración de JWT
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 600  # Tiempo de expiración del token (en minutos)

# Función para crear un token JWT
def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Función para verificar un token JWT
def verify_token(token: str) -> dict:
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded_token
    except JWTError:
        return None
