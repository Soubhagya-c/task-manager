from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.user import UserOut
from typing import List

class TaskBase(BaseModel):
    title: str
    description: str
    completed: Optional[bool] = False

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    id: int
    owner_id: int
    created_at: datetime
    owner: Optional[UserOut] = None

    class Config:
        from_attributes = True

class TaskListResponse(BaseModel):
    success: bool
    message: str
    data: Optional[List[TaskRead]] = None
