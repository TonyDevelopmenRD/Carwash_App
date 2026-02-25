# schemas/user.py
from pydantic import BaseModel, EmailStr
from datetime import datetime
from schemas.role import RoleRead

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role_id: int

class UserRead(UserBase):
    id: int
    role: RoleRead | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Esquema para el inicio de sesión (UserLogin)
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Esquema para el token de autenticación
class Token(BaseModel):
    access_token: str
    token_type: str
