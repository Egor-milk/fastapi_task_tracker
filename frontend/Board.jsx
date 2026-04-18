import React, { useState } from 'react'
import Column from './Column'

export default function Board({ users, tasks, onMoveTask, onCreateTask, onCreateUser }){
  const [newUserName, setNewUserName] = useState('')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskAuthor, setNewTaskAuthor] = useState(users[0]?.id || '')
  const [newTaskAssignee, setNewTaskAssignee] = useState(users[0]?.id || '')

  // update selects when users change
  React.useEffect(()=>{
    setNewTaskAuthor(users[0]?.id || '')
    setNewTaskAssignee(users[0]?.id || '')
  }, [users])

  const handleCreateUser = async (e)=>{
    e.preventDefault()
    if(!newUserName.trim()) return
    await onCreateUser(newUserName.trim())
    setNewUserName('')
  }

  const handleCreateTask = async (e)=>{
    e.preventDefault()
    if(!newTaskTitle.trim()) return
    await onCreateTask({ title: newTaskTitle.trim(), author_id: Number(newTaskAuthor), assignee_id: Number(newTaskAssignee) })
    setNewTaskTitle('')
  }

  return (
    <div className="board">
      <section className="controls">
        <form onSubmit={handleCreateUser} className="inline-form">
          <input placeholder="Новый пользователь" value={newUserName} onChange={e=>setNewUserName(e.target.value)} />
          <button type="submit">Добавить пользователя</button>
        </form>

        <form onSubmit={handleCreateTask} className="inline-form">
          <input placeholder="Новая задача" value={newTaskTitle} onChange={e=>setNewTaskTitle(e.target.value)} />
          <select value={newTaskAuthor} onChange={e=>setNewTaskAuthor(e.target.value)}>
            {users.map(u=> <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <select value={newTaskAssignee} onChange={e=>setNewTaskAssignee(e.target.value)}>
            {users.map(u=> <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <button type="submit">Добавить задачу</button>
        </form>
      </section>

      <div className="columns">
        {users.map(user=> (
          <Column key={user.id} user={user} tasks={tasks.filter(t=>t.assignee_id===user.id)} onMoveTask={onMoveTask} />
        ))}
      </div>
    </div>
  )
}
