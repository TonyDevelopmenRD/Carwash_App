# routes/vehicle.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.vehicle import VehicleCreate, VehicleRead
from models import Vehicle
from config.db import get_db
from middlewares.auth import verify_token_header

router = APIRouter()

# Crear un nuevo vehículo
@router.post("/", response_model=VehicleRead)
def create_vehicle(vehicle: VehicleCreate, db: Session = Depends(get_db), current_user: dict = Depends(verify_token_header)):
    db_vehicle = Vehicle(
        license_plate=vehicle.license_plate,
        model=vehicle.model,
        brand=vehicle.brand,
        client_id=vehicle.client_id
    )
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

# Obtener todos los vehículos
@router.get("/", response_model=list[VehicleRead])
def get_vehicles(db: Session = Depends(get_db), current_user: dict = Depends(verify_token_header)):
    return db.query(Vehicle).all()

# Obtener un vehículo por ID
@router.get("/{vehicle_id}", response_model=VehicleRead)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db), current_user: dict = Depends(verify_token_header)):
    db_vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if db_vehicle is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return db_vehicle

# Actualizar un vehículo
@router.put("/{vehicle_id}", response_model=VehicleRead)
def update_vehicle(vehicle_id: int, vehicle: VehicleCreate, db: Session = Depends(get_db), current_user: dict = Depends(verify_token_header)):
    db_vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if db_vehicle is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    db_vehicle.license_plate = vehicle.license_plate
    db_vehicle.model = vehicle.model
    db_vehicle.brand = vehicle.brand
    db_vehicle.client_id = vehicle.client_id
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

# Eliminar un vehículo
@router.delete("/{vehicle_id}", response_model=VehicleRead)
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db), current_user: dict = Depends(verify_token_header)):
    db_vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if db_vehicle is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    db.delete(db_vehicle)
    db.commit()
    return db_vehicle
