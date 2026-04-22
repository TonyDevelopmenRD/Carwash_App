import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.exc import OperationalError

from config.db import Base, engine
from routes import role, user, client, vehicle, service, auth, products, report

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

app = FastAPI(
    title="Car Wash API",
    description="API REST para la gestión de un sistema de autolavado. Permite administrar usuarios, roles, clientes, vehículos y servicios.",
    version="1.0.0",
    contact={
        "name": "Tony CR",
        "email": "tu_correo@example.com"
    },
    openapi_tags=[
        {"name": "Roles", "description": "Operaciones relacionadas con los roles"},
        {"name": "Users", "description": "Operaciones relacionadas con los usuarios"},
    ]
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 STARTUP REAL (espera a MySQL)
@app.on_event("startup")
def startup():
    retries = 10
    for i in range(retries):
        try:
            Base.metadata.create_all(bind=engine)
            print("Database connected ✅")
            break
        except OperationalError:
            print(f"Database not ready... retry {i+1}/{retries}")
            time.sleep(3)
    else:
        raise Exception("Database connection failed")

    if not app.openapi_schema:
        app.openapi_schema = app.openapi()
        app.openapi_schema["components"]["securitySchemes"] = {
            "BearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT",
            }
        }
        app.openapi_schema["security"] = [{"BearerAuth": []}]


# Routers
app.include_router(role.router, prefix="/roles", tags=["Roles"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(report.router, prefix="/reports", tags=["Reports"])
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(client.router, prefix="/clients", tags=["Clients"])
app.include_router(vehicle.router, prefix="/vehicles", tags=["Vehicles"])
app.include_router(service.router, prefix="/services", tags=["Services"])


@app.get("/")
def root():
    return {"message": "Car Wash API running 🚗🧼"}