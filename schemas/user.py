from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from schemas.role import RoleRead

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role_id: int = 1

class UserRead(UserBase):
    id: int
    role: RoleRead | None = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str