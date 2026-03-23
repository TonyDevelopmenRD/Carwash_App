from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime

from config.db import get_db
from models.product import Product
from models.service import Service
from models.vehicle import Vehicle
from models.user import User

from middlewares.auth import verify_token_header

router = APIRouter()


@router.get("/products")
def products_report(
    start_date: str | None = Query(None, description="Format: DD/MM/YY"),
    end_date: str | None = Query(None, description="Format: DD/MM/YY"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token_header)
):
    query = (
        db.query(
            Product.created_at.label("date"),
            User.username.label("cashier"),
            Service.name.label("service_name"),
            Product.price.label("cost"),
            Product.description.label("description"),
            Vehicle.license_plate.label("plates"),
            Vehicle.brand.label("brand"),
            Vehicle.model.label("model")
        )
        .join(Service, Product.service_id == Service.id)
        .join(User, Service.user_id == User.id)
        .join(Vehicle, Service.vehicle_id == Vehicle.id)
    )

    filters = []

    if start_date:
        try:
            parsed_start = datetime.strptime(start_date, "%d/%m/%y")
            filters.append(Product.created_at >= parsed_start)
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="start_date must be in format DD/MM/YY"
            )

    if end_date:
        try:
            parsed_end = datetime.strptime(end_date, "%d/%m/%y")
            parsed_end = parsed_end.replace(hour=23, minute=59, second=59)
            filters.append(Product.created_at <= parsed_end)
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="end_date must be in format DD/MM/YY"
            )

    if filters:
        query = query.filter(and_(*filters))

    results = query.all()

    return [
        {
            "date": r.date,
            "cashier": r.cashier,
            "service_name": r.service_name,
            "cost": float(r.cost),
            "description": r.description,
            "plates": r.plates,
            "brand": r.brand,
            "model": r.model,
        }
        for r in results
    ]