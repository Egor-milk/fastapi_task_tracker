import React, { useState } from 'react'
import Column from './Column'

export default function Board({ users, tasks, onMoveTask, onCreateTask, onCreateUser, onEditTask }){
  const [newUserName, setNewUserName] = useState('')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskAuthor, setNewTaskAuthor] = useState(users[0]?.id || '')
  const [newTaskAssignee, setNewTaskAssignee] = useState(users[0]?.id || '')
  const [newTaskStatus, setNewTaskStatus] = useState('queue')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [showEditModal, setShowEditModal] = useState(false)
  const [editTask, setEditTask] = useState(null)

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

  const openEditModal = (task)=>{
    setEditTask({ id: task.id, title: task.title, author_id: task.author_id, assignee_id: task.assignee_id, status: task.status })
    setShowEditModal(true)
  }
  const closeEditModal = ()=>{
    setEditTask(null)
    setShowEditModal(false)
  }

  const handleEditSubmit = async (e)=>{
    e.preventDefault()
    if(!editTask || !editTask.title.trim()) return
    await onEditTask(editTask.id, { title: editTask.title.trim(), author_id: Number(editTask.author_id), assignee_id: Number(editTask.assignee_id), status: editTask.status })
    closeEditModal()
  }

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
          <Column key={col.id} column={col} tasks={tasks.filter(t=>t.status===col.id)} onMoveTask={onMoveTask} users={users} onEditClick={openEditModal} />
        ))}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={closeCreateModal}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <button className="modal-close" onClick={closeCreateModal}>×</button>
            <h3>Создать задачу</h3>
            <form onSubmit={handleCreateTask} className="modal-form">
              <label htmlFor="task-title">Название задачи</label>
              <input id="task-title" placeholder="Новая задача" value={newTaskTitle} onChange={e=>setNewTaskTitle(e.target.value)} />

              <label htmlFor="task-author">Автор</label>
              <select id="task-author" value={newTaskAuthor} onChange={e=>setNewTaskAuthor(e.target.value)}>
                {users.map(u=> <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>

              <label htmlFor="task-assignee">Исполнитель</label>
              <select id="task-assignee" value={newTaskAssignee} onChange={e=>setNewTaskAssignee(e.target.value)}>
                {users.map(u=> <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>

              <label htmlFor="task-status">Статус</label>
              <select id="task-status" value={newTaskStatus} onChange={e=>setNewTaskStatus(e.target.value)}>
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

      {showEditModal && editTask && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <button className="modal-close" onClick={closeEditModal}>×</button>
            <h3>Редактировать задачу</h3>
            <form onSubmit={handleEditSubmit} className="modal-form">
              <label htmlFor="edit-task-title">Название задачи</label>
              <input id="edit-task-title" value={editTask.title} onChange={e=>setEditTask(prev=>({...prev, title: e.target.value}))} />

              <label htmlFor="edit-task-author">Автор</label>
              <select id="edit-task-author" value={editTask.author_id} onChange={e=>setEditTask(prev=>({...prev, author_id: e.target.value}))}>
                {users.map(u=> <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>

              <label htmlFor="edit-task-assignee">Исполнитель</label>
              <select id="edit-task-assignee" value={editTask.assignee_id} onChange={e=>setEditTask(prev=>({...prev, assignee_id: e.target.value}))}>
                {users.map(u=> <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>

              <label htmlFor="edit-task-status">Статус</label>
              <select id="edit-task-status" value={editTask.status} onChange={e=>setEditTask(prev=>({...prev, status: e.target.value}))}>
                {columns.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
                <button type="button" onClick={closeEditModal}>Отмена</button>
                <button type="submit">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
