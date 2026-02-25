from config.db import engine
from models import Role, User, Client, Vehicle, Service

# Crear todas las tablas si no existen
Role.metadata.create_all(bind=engine)
User.metadata.create_all(bind=engine)
Client.metadata.create_all(bind=engine)
Vehicle.metadata.create_all(bind=engine)
Service.metadata.create_all(bind=engine)

print("Tablas creadas correctamente.")
