from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database import models
from app.schemas.user_schema import UserRead, UserOut, UserUpdate
from app.dependencies import get_current_user
from app.core.security import hash_password
from typing import List

router = APIRouter()

@router.post("/", response_model=UserOut)
def create_user(payload: UserRead, db: Session = Depends(get_db)):
    if db.query(models.User).filter((models.User.username == payload.username) | (models.User.email == payload.email)).first():
        raise HTTPException(status_code=400, detail="User exists")
    user = models.User(username=payload.username, email=payload.email, hashed_password=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@router.get("/profile", response_model=UserOut)
def get_profile(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserOut)
def update_profile(payload: UserUpdate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    if not payload.name:
        raise HTTPException(
            status_code=401,
            detail="Name is required"
        )
    user.name = payload.name
    db.commit()
    db.refresh(user)
    return user

