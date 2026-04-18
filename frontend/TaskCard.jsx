import React from 'react'

export default function TaskCard({ task, users = [] }){
  const onDragStart = (e)=>{
    e.dataTransfer.setData('text/taskId', String(task.id))
  }

  const findName = (id)=>{
    const u = users.find(u => u.id == id)
    return u ? u.name : id
  }

  return (
    <div className="task" draggable onDragStart={onDragStart}>
      <div className="task-title">{task.title}</div>
      <div className="task-meta">Автор: {findName(task.author_id)} | Исполн.: {findName(task.assignee_id)}</div>
    </div>
  )
}
