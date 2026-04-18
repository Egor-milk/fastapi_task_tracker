import React, { useState } from 'react'
import Column from './Column'

export default function Board({ users, tasks, onMoveTask, onCreateTask, onCreateUser }){
  const [newUserName, setNewUserName] = useState('')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskAuthor, setNewTaskAuthor] = useState(users[0]?.id || '')
  const [newTaskAssignee, setNewTaskAssignee] = useState(users[0]?.id || '')
  const [newTaskStatus, setNewTaskStatus] = useState('queue')
  const [showCreateModal, setShowCreateModal] = useState(false)

  React.useEffect(()=>{
    setNewTaskAuthor(users[0]?.id || '')
    setNewTaskAssignee(users[0]?.id || '')
    setNewTaskStatus('queue')
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
    await onCreateTask({ title: newTaskTitle.trim(), author_id: Number(newTaskAuthor), assignee_id: Number(newTaskAssignee), status: newTaskStatus })
    setNewTaskTitle('')
    setNewTaskStatus('queue')
    setShowCreateModal(false)
  }

  const openCreateModal = ()=> setShowCreateModal(true)
  const closeCreateModal = ()=> setShowCreateModal(false)

  const columns = [
    { id: 'queue', name: 'Очередь' },
    { id: 'in_progress', name: 'В работе' },
    { id: 'done', name: 'Готов' }
  ]

  return (
    <div className="board">
      <section className="controls">
        <form onSubmit={handleCreateUser} className="inline-form">
          <input placeholder="Новый пользователь" value={newUserName} onChange={e=>setNewUserName(e.target.value)} />
          <button type="submit">Добавить пользователя</button>
        </form>

        <div className="inline-form">
          <button onClick={openCreateModal}>Добавить задачу</button>
        </div>
      </section>

      <div className="columns">
        {columns.map(col=> (
          <Column key={col.id} column={col} tasks={tasks.filter(t=>t.status===col.id)} onMoveTask={onMoveTask} />
        ))}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={closeCreateModal}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <button className="modal-close" onClick={closeCreateModal}>×</button>
            <h3>Создать задачу</h3>
            <form onSubmit={handleCreateTask} className="modal-form">
              <input placeholder="Новая задача" value={newTaskTitle} onChange={e=>setNewTaskTitle(e.target.value)} />
              <select value={newTaskAuthor} onChange={e=>setNewTaskAuthor(e.target.value)}>
                {users.map(u=> <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              <select value={newTaskAssignee} onChange={e=>setNewTaskAssignee(e.target.value)}>
                {users.map(u=> <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              <select value={newTaskStatus} onChange={e=>setNewTaskStatus(e.target.value)}>
                {columns.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
                <button type="button" onClick={closeCreateModal}>Отмена</button>
                <button type="submit">Добавить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
