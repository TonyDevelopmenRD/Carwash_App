from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from models.mixins import TimestampMixin
from config.db import Base

class Client(Base, TimestampMixin):
    __tablename__ = "clients"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=True)
    phone = Column(String(20), nullable=True)
    
    vehicles = relationship("Vehicle", back_populates="owner")
