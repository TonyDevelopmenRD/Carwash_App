# routes/service.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.service import ServiceCreate, ServiceRead
from models import Service
from config.db import get_db

router = APIRouter()

# Crear un nuevo servicio
@router.post("/", response_model=ServiceRead)
def create_service(service: ServiceCreate, db: Session = Depends(get_db)):
    db_service = Service(
        name=service.name,
        description=service.description,
        price=service.price,
        vehicle_id=service.vehicle_id,
        user_id=service.user_id
    )
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

# Obtener todos los servicios
@router.get("/", response_model=list[ServiceRead])
def get_services(db: Session = Depends(get_db)):
    return db.query(Service).all()

# Obtener un servicio por ID
@router.get("/{service_id}", response_model=ServiceRead)
def get_service(service_id: int, db: Session = Depends(get_db)):
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if db_service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    return db_service

# Actualizar un servicio
@router.put("/{service_id}", response_model=ServiceRead)
def update_service(service_id: int, service: ServiceCreate, db: Session = Depends(get_db)):
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if db_service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    
    db_service.name = service.name
    db_service.description = service.description
    db_service.price = service.price
    db_service.vehicle_id = service.vehicle_id
    db_service.user_id = service.user_id
    db.commit()
    db.refresh(db_service)
    return db_service

# Eliminar un servicio
@router.delete("/{service_id}", response_model=ServiceRead)
def delete_service(service_id: int, db: Session = Depends(get_db)):
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if db_service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    
    db.delete(db_service)
    db.commit()
    return db_service
