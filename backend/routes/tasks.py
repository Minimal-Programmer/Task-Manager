from fastapi import APIRouter, Depends, HTTPException, Query
from database import tasks_collection, users_collection, db
from schemas import TaskCreate, TaskResponse
from auth import get_current_user
from bson import ObjectId
from typing import List, Optional
from pymongo import ASCENDING, DESCENDING
from datetime import datetime, timezone
from pydantic import BaseModel, validator
import dateutil.parser
from enum import Enum

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str  # "low", "medium", "high"
    due_date: datetime  # Expecting datetime in UTC format
    assigned_to : str
    completed: Optional[bool] = False

    @validator("due_date", pre=True)
    def parse_datetime(cls, value):
        if isinstance(value, str):
            return dateutil.parser.isoparse(value)  # Parses "Z" format properly
        return value

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    completed: Optional[bool] = None 

class PriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

router = APIRouter(prefix="/tasks")

@router.post("/create", response_model=TaskResponse)
async def create_task(task: TaskCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "superuser":
        raise HTTPException(status_code=403, detail="Only superusers can create tasks")

    assigned_user = await users_collection.find_one({"username": task.assigned_to, "role": {"$ne": "superuser"}})
    if not assigned_user:
        raise HTTPException(status_code=400, detail="Assigned user not found or is an admin")

    task_dict = task.dict()
    task_dict["assigned_to"] = assigned_user["username"]
    task_dict["_id"] = ObjectId()
    task_dict["created_at"] = datetime.utcnow()
    task_dict["updated_at"] = datetime.utcnow()

    await tasks_collection.insert_one(task_dict)
    return {"id": str(task_dict["_id"]), **task_dict}


@router.get("/", response_model=List[TaskResponse])
async def get_all_tasks():
    try:
        # Fetch all tasks
        tasks = await tasks_collection.find({}).to_list(None)

        # Convert MongoDB `_id` to `id` and ensure `due_date` is formatted
        formatted_tasks = [
            TaskResponse(
                id=str(task["_id"]),
                title=task["title"],
                description=task["description"],
                priority=task["priority"],
                due_date=task.get("due_date"),
                assigned_to=task["assigned_to"],
                completed=task.get("completed", False),
                created_at=task["created_at"],
                updated_at=task["updated_at"],
            )
            for task in tasks
        ]

        return formatted_tasks

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: str, updated_task: TaskUpdate):
    existing_task = await tasks_collection.find_one({"_id": ObjectId(task_id)})

    if not existing_task:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = updated_task.dict(exclude_unset=True)  # Only update provided fields
    await tasks_collection.update_one({"_id": ObjectId(task_id)}, {"$set": update_data})

    updated_task = await tasks_collection.find_one({"_id": ObjectId(task_id)})
    updated_task["id"] = str(updated_task["_id"])
    return updated_task

@router.put("/complete/{task_id}")
async def mark_task_completed(task_id: str, current_user: dict = Depends(get_current_user)):
    # Convert task_id to ObjectId
    try:
        task_obj_id = ObjectId(task_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid task ID format")

    # Fetch task from DB
    task = await tasks_collection.find_one({"_id": task_obj_id})

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task["assigned_to"] != current_user["username"]:
        raise HTTPException(status_code=403, detail="You can only complete your assigned tasks")

    # Mark task as completed
    await tasks_collection.update_one({"_id": task_obj_id}, {"$set": {"completed": True}})
    
    return {"message": "Task marked as completed"}

@router.delete("/{task_id}")
async def delete_task(task_id: str, current_user: dict = Depends(get_current_user)):
    """✅ Delete a task (Only Superusers)"""

    # ✅ Ensure only superusers can delete tasks
    if current_user["role"] != "superuser":
        raise HTTPException(status_code=403, detail="Only superusers can delete tasks")

    # ✅ Validate ObjectId format
    if not ObjectId.is_valid(task_id):
        raise HTTPException(status_code=400, detail="Invalid task ID format")

    # ✅ Check if the task exists
    task = await tasks_collection.find_one({"_id": ObjectId(task_id)})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # ✅ Delete the task
    result = await tasks_collection.delete_one({"_id": ObjectId(task_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=500, detail="Failed to delete task")

    return {"message": "Task deleted successfully"}

