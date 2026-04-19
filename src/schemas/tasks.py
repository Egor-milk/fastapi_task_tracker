from time import struct_time
from typing import Optional

from pydantic import BaseModel


class TaskSchema(BaseModel):
    id: int
    title: str
    author_id: int
    assignee_id: int
    status: str

    class Config:
        from_attributes = True


class TaskSchemaAdd(BaseModel):
    title: str
    author_id: int
    assignee_id: int
    status: str


class TaskSchemaEdit(BaseModel):
    title: str
    author_id: int
    assignee_id: int
    status: str

class TaskHistorySchema(BaseModel):
    id: int
    task_id: int
    previous_title: str
    new_title: str
    previous_author_id: int
    new_author_id: int
    previous_assignee_id: int
    new_assignee_id: int
    previous_status: str
    new_status: str

class TaskHistorySchemaAdd(BaseModel):
    task_id: int
    previous_title: str
    new_title: str
    previous_author_id: int
    new_author_id: int
    previous_assignee_id: int
    new_assignee_id: int
    previous_status: str
    new_status: str