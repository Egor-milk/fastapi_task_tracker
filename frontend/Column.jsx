import React from 'react'
import TaskCard from './TaskCard'

export default function Column({ column, tasks, onMoveTask, users, onEditClick }){
  const allowDrop = (e)=> e.preventDefault()
  const onDrop = (e)=>{
    e.preventDefault()
    const taskId = Number(e.dataTransfer.getData('text/taskId'))
    if(!taskId) return
    onMoveTask(taskId, column.id)
  }

  return (
    <div className="column" onDragOver={allowDrop} onDrop={onDrop}>
      <h3>{column.name}</h3>
      <div className="task-list">
        {tasks.map(t=> <TaskCard key={t.id} task={t} users={users} onEditClick={onEditClick} />)}
      </div>
    </div>
  )
}
