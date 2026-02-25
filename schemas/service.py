# schemas/service.py
from pydantic import BaseModel
from datetime import datetime

class ServiceBase(BaseModel):
    name: str
    description: str | None = None
    price: float
    vehicle_id: int
    user_id: int | None = None

class ServiceCreate(ServiceBase):
    pass

class ServiceRead(ServiceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
