# routes/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.user import UserLogin, Token  # Asegúrate de importar el esquema UserLogin
from core.security import hash_password, verify_password, create_access_token
from models import User
from config.db import get_db

router = APIRouter()

# Ruta para login
@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    # Buscar el usuario en la base de datos por email
    db_user = db.query(User).filter(User.email == user.email).first()
    
    # Si el usuario no existe o la contraseña no coincide
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Crear un token JWT
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}
