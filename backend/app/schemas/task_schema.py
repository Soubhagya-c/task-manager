from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.user_schema import UserOut
from typing import List
from app.database.models import TaskStatus

class TaskBase(BaseModel):
    title: str
    description: str
    status: Optional[TaskStatus] = TaskStatus.pending
    is_deleted: Optional[bool] = False

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

from pydantic import BaseModel
from typing import List

class PaginatedTasks(BaseModel):
    data: List[TaskRead]
    page: int
    limit: int
    total: int
    hasNext: bool
    hasPrev: bool

