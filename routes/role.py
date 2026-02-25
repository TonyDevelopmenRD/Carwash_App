# routes/role.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.role import RoleCreate, RoleRead
from models import Role
from config.db import get_db

router = APIRouter()

# Crear un nuevo rol
@router.post("/", response_model=RoleRead)
def create_role(role: RoleCreate, db: Session = Depends(get_db)):
    db_role = Role(name=role.name, description=role.description)
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

# Obtener todos los roles
@router.get("/", response_model=list[RoleRead])
def get_roles(db: Session = Depends(get_db)):
    return db.query(Role).all()

# Obtener un rol por ID
@router.get("/{role_id}", response_model=RoleRead)
def get_role(role_id: int, db: Session = Depends(get_db)):
    db_role = db.query(Role).filter(Role.id == role_id).first()
    if db_role is None:
        raise HTTPException(status_code=404, detail="Role not found")
    return db_role

# Actualizar un rol
@router.put("/{role_id}", response_model=RoleRead)
def update_role(role_id: int, role: RoleCreate, db: Session = Depends(get_db)):
    db_role = db.query(Role).filter(Role.id == role_id).first()
    if db_role is None:
        raise HTTPException(status_code=404, detail="Role not found")
    
    db_role.name = role.name
    db_role.description = role.description
    db.commit()
    db.refresh(db_role)
    return db_role

# Eliminar un rol
@router.delete("/{role_id}", response_model=RoleRead)
def delete_role(role_id: int, db: Session = Depends(get_db)):
    db_role = db.query(Role).filter(Role.id == role_id).first()
    if db_role is None:
        raise HTTPException(status_code=404, detail="Role not found")
    
    db.delete(db_role)
    db.commit()
    return db_role
