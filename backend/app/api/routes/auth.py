from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import User
from app.schemas.user import UserRead, LoginRequest
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter()

@router.post("/register")
def register(user: UserRead, db: Session = Depends(get_db)):
	if db.query(User).filter(User.email == user.email).first():
		raise HTTPException(status_code=400, detail="Email already registered")
	new_user = User(
		name=user.name,
		email=user.email,
		hashed_password=hash_password(user.password)
	)
	db.add(new_user)
	db.commit()
	db.refresh(new_user)
	return {"message": "User registered successfully"}

@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(email=user.email)

    return {
        "access_token": token,
        "token_type": "bearer"
    }
