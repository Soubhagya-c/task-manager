from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Task
from app.schemas.task import TaskCreate, PaginatedTasks, TaskListResponse
from app.dependencies import get_current_user
from app.utils.response import success_response
from fastapi import Query

router = APIRouter()

@router.post("/", response_model=TaskListResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db), user = Depends(get_current_user)):
    new_task = Task(**task.dict(), owner_id=user.id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return success_response([new_task], "Task created successfully")

@router.get("/", response_model=PaginatedTasks)
def get_tasks(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    page: int = Query(1, ge=1),
    limit: int = Query(3, ge=1, le=50),
    status: Optional[str] = None
):
    if status:
        query = (
            db.query(Task)
            .filter(Task.owner_id == user.id)
            .filter(Task.status == status)
            .filter(Task.is_deleted == False)
        )
    else:
        query = (
            db.query(Task)
            .filter(Task.owner_id == user.id)
            .filter(Task.is_deleted == False)
        )
    
    query = query.order_by(Task.created_at.desc())

    total = query.count()

    skip = (page - 1) * limit
    tasks = query.offset(skip).limit(limit).all()

    return {
        "data": tasks,
        "page": page,
        "limit": limit,
        "total": total,
        "hasNext": skip + limit < total,
        "hasPrev": page > 1
    }


@router.put("/{task_id}", response_model=TaskListResponse)
def update_task(task_id: int, task: TaskCreate, db: Session = Depends(get_db), user = Depends(get_current_user)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.owner_id == user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    db_task.title = task.title
    db_task.description = task.description
    db_task.status = task.status
    db.commit()
    db.refresh(db_task)

    return success_response([db_task], "Task updated successfully")


@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id, Task.owner_id == user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.is_deleted = True
    db.commit()
    return {"detail": "Task deleted"}

@router.post("/{task_id}/restore")
def restore_task(task_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id, Task.owner_id == user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.is_deleted = False
    db.commit()
    return {"detail": "Task restored"}

