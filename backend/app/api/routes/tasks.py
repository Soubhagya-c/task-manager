from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Task
from app.schemas.task import TaskCreate, TaskRead, TaskListResponse
from app.dependencies import get_current_user
from app.utils.response import success_response  # 🔹 ADDED

router = APIRouter()

@router.post("/", response_model=TaskListResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db), user = Depends(get_current_user)):
    new_task = Task(**task.dict(), owner_id=user.id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return success_response([new_task], "Task created successfully")

@router.get("/", response_model=list[TaskRead])
def get_tasks(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    tasks = db.query(Task).filter(Task.owner_id == user.id).all()
    return tasks

@router.put("/{task_id}", response_model=TaskListResponse)
def update_task(task_id: int, task: TaskCreate, db: Session = Depends(get_db), user = Depends(get_current_user)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.owner_id == user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    db_task.title = task.title
    db_task.description = task.description
    db.commit()
    db.refresh(db_task)

    return success_response([db_task], "Task updated successfully")


@router.delete("/{task_id}", response_model=TaskListResponse)
def delete_task(task_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.owner_id == user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(db_task)
    db.commit()

    return success_response(message="Task deleted successfully")
