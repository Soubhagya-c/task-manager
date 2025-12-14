from pydantic import BaseModel, EmailStr

class UserRead(BaseModel):
	name: str
	email: EmailStr
	password: str

class UserOut(BaseModel):
	id: int
	name: str
	email: EmailStr

	class Config:
		from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str