from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class Task(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = Field(default="medium", pattern="^(low|medium|high)$")
    due_date: Optional[datetime] = None
    assigned_to: Optional[str] = None  # User ID
    completed: bool = False
    owner_id: str  # User who created the task
