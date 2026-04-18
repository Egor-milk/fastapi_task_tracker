import React from 'react'
import TaskCard from './TaskCard'

export default function Column({ user, tasks, onMoveTask }){
  const allowDrop = (e)=> e.preventDefault()
  const onDrop = (e)=>{
    e.preventDefault()
    const taskId = Number(e.dataTransfer.getData('text/taskId'))
    if(!taskId) return
    onMoveTask(taskId, user.id)
  }

  return (
    <div className="column" onDragOver={allowDrop} onDrop={onDrop}>
      <h3>{user.name}</h3>
      <div className="task-list">
        {tasks.map(t=> <TaskCard key={t.id} task={t} />)}
      </div>
    </div>
  )
}
