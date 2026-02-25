from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from models.mixins import TimestampMixin
from config.db import Base

class Vehicle(Base, TimestampMixin):
    __tablename__ = "vehicles"
    
    id = Column(Integer, primary_key=True, index=True)
    license_plate = Column(String(20), unique=True, nullable=False)
    model = Column(String(50), nullable=True)
    brand = Column(String(50), nullable=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    
    owner = relationship("Client", back_populates="vehicles")
    services = relationship("Service", back_populates="vehicle")
