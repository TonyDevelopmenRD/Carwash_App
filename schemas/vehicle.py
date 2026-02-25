# schemas/vehicle.py
from pydantic import BaseModel
from datetime import datetime

class VehicleBase(BaseModel):
    license_plate: str
    model: str | None = None
    brand: str | None = None
    client_id: int

class VehicleCreate(VehicleBase):
    pass

class VehicleRead(VehicleBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
