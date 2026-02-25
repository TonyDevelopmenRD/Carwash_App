from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config.db import Base, engine
from models import User, Role, Client, Vehicle
from core.security import hash_password
from datetime import datetime

# Crear la sesión local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_roles(db):
    """Agregar roles predeterminados a la base de datos."""
    roles = [
        {"name": "Admin", "description": "Administrador del sistema"},
        {"name": "User", "description": "Usuario regular"},
    ]
    
    for role in roles:
        db_role = db.query(Role).filter(Role.name == role["name"]).first()
        if not db_role:
            db_role = Role(**role)
            db.add(db_role)
    db.commit()

def seed_users(db):
    """Agregar usuarios predeterminados a la base de datos."""
    users = [
        {"username": "admin", "email": "admin@example.com", "password": "pelos2008", "role_id": 1},
        {"username": "user", "email": "user@example.com", "password": "pelos2008", "role_id": 2},
    ]
    
    for user in users:
        db_user = db.query(User).filter(User.email == user["email"]).first()
        if not db_user:
            # Hashear las contraseñas
            user["password"] = hash_password(user["password"])
            db_user = User(**user)
            db.add(db_user)
    db.commit()

def seed_clients(db):
    """Agregar clientes predeterminados a la base de datos."""
    clients = [
        {"name": "Client One", "email": "client1@example.com", "phone": "123456789"},
        {"name": "Client Two", "email": "client2@example.com", "phone": "987654321"},
    ]
    
    for client in clients:
        db_client = db.query(Client).filter(Client.email == client["email"]).first()
        if not db_client:
            db_client = Client(**client)
            db.add(db_client)
    db.commit()

def seed_vehicles(db):
    """Agregar vehículos predeterminados a la base de datos."""
    vehicles = [
        {"license_plate": "ABC123", "model": "Model X", "brand": "Tesla", "client_id": 1},
        {"license_plate": "XYZ456", "model": "Civic", "brand": "Honda", "client_id": 2},
    ]
    
    for vehicle in vehicles:
        db_vehicle = db.query(Vehicle).filter(Vehicle.license_plate == vehicle["license_plate"]).first()
        if not db_vehicle:
            db_vehicle = Vehicle(**vehicle)
            db.add(db_vehicle)
    db.commit()

def populate_db():
    """Función principal que crea las tablas y pobla la base de datos."""
    # Crear las tablas si no existen
    Base.metadata.create_all(bind=engine)

    # Crear una nueva sesión de la base de datos
    db = SessionLocal()

    try:
        # Poblar con datos iniciales
        seed_roles(db)
        seed_users(db)
        seed_clients(db)
        seed_vehicles(db)

        print("Base de datos poblada con datos iniciales.")
    finally:
        # Asegurarse de cerrar la sesión correctamente
        db.close()

# Ejecutar el seeding
if __name__ == "__main__":
    try:
        populate_db()
    except Exception as e:
        print(f"Error al poblar la base de datos: {e}")
