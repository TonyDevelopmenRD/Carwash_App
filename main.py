from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer
from config.db import Base, engine
from routes import role, user, client, vehicle, service, auth

# Crear una instancia del esquema OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Crear la aplicación FastAPI
app = FastAPI(
    title="Car Wash API",
    version="1.0.0",
    # Aquí configuramos el esquema de seguridad
    openapi_tags=[  # Puedes agregar tus tags aquí para Swagger
        {"name": "Roles", "description": "Operaciones relacionadas con los roles"},
        {"name": "Users", "description": "Operaciones relacionadas con los usuarios"},
    ]
)

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Agregar las rutas (routers)
app.include_router(role.router, prefix="/roles", tags=["Roles"])
app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(client.router, prefix="/clients", tags=["Clients"])
app.include_router(vehicle.router, prefix="/vehicles", tags=["Vehicles"])
app.include_router(service.router, prefix="/services", tags=["Services"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])

# Definir la seguridad global en OpenAPI (Swagger)
@app.on_event("startup")
async def configure_openapi():
    if app.openapi_schema:
        return  # Ya está configurado

    app.openapi_schema = app.openapi()

    # Agregar el esquema de seguridad Bearer token
    app.openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    
    # Configurar las rutas para que utilicen BearerAuth
    app.openapi_schema["security"] = [{"BearerAuth": []}]

@app.get("/")
def root():
    return {"message": "Car Wash API running 🚗🧼"}
