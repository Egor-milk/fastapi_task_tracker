import React from 'react'

export default function TaskCard({ task }){
  const onDragStart = (e)=>{
    e.dataTransfer.setData('text/taskId', String(task.id))
  }

  return (
    <div className="task" draggable onDragStart={onDragStart}>
      <div className="task-title">{task.title}</div>
      <div className="task-meta">Автор: {task.author_id} | Исполн.: {task.assignee_id}</div>
    </div>
  )
}
