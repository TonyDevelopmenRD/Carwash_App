# schemas/client.py
from pydantic import BaseModel, EmailStr
from datetime import datetime

class ClientBase(BaseModel):
    name: str
    email: EmailStr | None = None
    phone: str | None = None

class ClientCreate(ClientBase):
    pass

class ClientRead(ClientBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
