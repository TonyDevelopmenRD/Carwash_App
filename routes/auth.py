from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from schemas.user import UserLogin, Token, UserCreate
from core.security import hash_password, verify_password, create_access_token
from models import User
from config.db import get_db

router = APIRouter()

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register")
async def register(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    print("📦 BODY RECIBIDO:", body)  # ← esto nos muestra qué llega exactamente
    
    existing = db.query(User).filter(User.email == body.get("email")).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(
        username=body.get("username"),
        email=body.get("email"),
        password=hash_password(body.get("password")),
        role_id=1
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user