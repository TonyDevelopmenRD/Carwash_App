from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from models.mixins import TimestampMixin
from config.db import Base  # <-- IMPORTANTE

class Service(Base, TimestampMixin):
    __tablename__ = "services"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    price = Column(Float, nullable=False)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    vehicle = relationship("Vehicle", back_populates="services")
    user = relationship("User", back_populates="services")
