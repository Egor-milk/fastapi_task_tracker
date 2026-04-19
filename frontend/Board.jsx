import React, { useState } from 'react'
import Column from './Column'

export default function Board({ users, tasks, onMoveTask, onCreateTask, onCreateUser, onEditTask, onViewHistory }){
  const [newUserName, setNewUserName] = useState('')
  const [showCreateUserModal, setShowCreateUserModal] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskAuthor, setNewTaskAuthor] = useState(users[0]?.id || '')
  const [newTaskAssignee, setNewTaskAssignee] = useState(users[0]?.id || '')
  const [newTaskStatus, setNewTaskStatus] = useState('queue')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [showEditModal, setShowEditModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [history, setHistory] = useState([])

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
    setShowCreateUserModal(false)
  }

  const openCreateUserModal = ()=> setShowCreateUserModal(true)
  const closeCreateUserModal = ()=> { setNewUserName(''); setShowCreateUserModal(false) }


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

  const findName = (id)=>{
    const u = users.find(u=>u.id == id)
    return u ? u.name : id
  }

  const openHistory = async ()=>{
    if(!onViewHistory) return
    const data = await onViewHistory()
    setHistory(data || [])
    setShowHistoryModal(true)
  }
  const closeHistory = ()=> setShowHistoryModal(false)

  return (
    <div className="board">
      <section className="controls">
        <div className="inline-form">
          <button onClick={openCreateUserModal}>Добавить пользователя</button>
        </div>

        <div className="inline-form">
          <button onClick={openCreateModal}>Добавить задачу</button>
        </div>

        <div className="inline-form">
          <button onClick={openHistory}>История</button>
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

      {showCreateUserModal && (
        <div className="modal-overlay" onClick={closeCreateUserModal}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <button className="modal-close" onClick={closeCreateUserModal}>×</button>
            <div className="modal-title">Добавить пользователя</div>
            <div className="modal-body">
              <form onSubmit={handleCreateUser} className="modal-form">
                <label htmlFor="new-user-name">Имя</label>
                <input id="new-user-name" placeholder="Имя пользователя" value={newUserName} onChange={e=>setNewUserName(e.target.value)} />

                <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
                  <button type="button" onClick={closeCreateUserModal}>Отмена</button>
                  <button type="submit">Добавить</button>
                </div>
              </form>
            </div>
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

      {showHistoryModal && (
        <div className="modal-overlay" onClick={closeHistory}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <button className="modal-close" onClick={closeHistory}>×</button>
            <div className="modal-title">История изменений</div>
            <div className="modal-body">
              {history.length===0 ? <p>Записей не найдено</p> : (
                <div style={{maxHeight:300, overflow:'auto'}}>
                  {history.map(h=> (
                    <div key={h.id} style={{padding:8, borderBottom:'1px solid #e6eefc'}}>
                      <div><strong>Задача #{h.task_id}</strong></div>
                      <div>Название: "{h.previous_title}" → "{h.new_title}"</div>
                      <div>Автор: {findName(h.previous_author_id)} → {findName(h.new_author_id)}</div>
                      <div>Исполнитель: {findName(h.previous_assignee_id)} → {findName(h.new_assignee_id)}</div>
                      <div>Статус: {h.previous_status} → {h.new_status}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="actions">
              <button type="button" onClick={closeHistory}>Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
