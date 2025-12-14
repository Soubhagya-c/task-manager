from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import User
from app.schemas.user_schema import UserRead, LoginRequest
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token
from fastapi import Body
from jose import jwt, JWTError
from app.core.config import settings

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
    refresh_token = create_refresh_token(email=user.email)
    
    return {
        "access_token": token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh")
def refresh_token(refresh_token: str = Body(...), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("email")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    new_access_token = create_access_token(email=user.email)
    return {"access_token": new_access_token, "token_type": "bearer"}

