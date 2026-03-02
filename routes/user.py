from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from schemas.user import UserCreate, UserRead
from models import User
from config.db import get_db
from core.security import hash_password, create_access_token

router = APIRouter()

# Crear un nuevo usuario
@router.post("/", response_model=UserRead)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Verificar si el email o username ya existen
    db_user = db.query(User).filter((User.email == user.email) | (User.username == user.username)).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email or username already registered")
    
    # Hashear la contraseña antes de almacenarla
    hashed_password = hash_password(user.password)
    
    # Crear el usuario
    db_user = User(username=user.username, email=user.email, password=hashed_password, role_id=user.role_id)
    
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error: Integrity error, possible conflict with unique fields.")
    
    # Crear el token JWT para el nuevo usuario (opcional)
    access_token = create_access_token(data={"sub": db_user.email})
    
    return db_user;

# Obtener todos los usuarios con paginación
@router.get("/", response_model=list[UserRead])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Implementación básica de paginación
    users = db.query(User).offset(skip).limit(limit).all()
    return users

# Obtener un usuario por ID
@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# Actualizar un usuario
@router.put("/{user_id}", response_model=UserRead)
def update_user(user_id: int, user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.username = user.username
    db_user.email = user.email

    # Si se envía una nueva contraseña, hashearla antes de almacenarla
    if user.password:
        db_user.password = hash_password(user.password)
    
    db_user.role_id = user.role_id
    db.commit()
    db.refresh(db_user)
    
    return db_user

# Eliminar un usuario
@router.delete("/{user_id}", response_model=UserRead)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(db_user)
    db.commit()
    
    return db_user
