# models/role.py
from sqlalchemy import Column, Integer, String
from models.mixins import TimestampMixin
from config.db import Base

class Role(Base, TimestampMixin):
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(255), nullable=True)
