import React, { useEffect, useState } from 'react'
import Board from './Board'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function App(){
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async ()=>{
    setLoading(true)
    const [uRes, tRes] = await Promise.all([
      fetch(`${API_BASE}/users`),
      fetch(`${API_BASE}/tasks`),
    ])
    const [usersData, tasksData] = await Promise.all([uRes.json(), tRes.json()])
    setUsers(usersData)
    setTasks(tasksData)
    setLoading(false)
  }

  useEffect(()=>{ fetchData() }, [])

  const onMoveTask = async (taskId, newAssigneeId) =>{
    const task = tasks.find(t=>t.id===taskId)
    if(!task) return
    await fetch(`${API_BASE}/tasks/${taskId}`,{
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author_id: task.author_id, assignee_id: newAssigneeId })
    })
    await fetchData()
  }

  const onCreateTask = async ({ title, author_id, assignee_id })=>{
    await fetch(`${API_BASE}/tasks`,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author_id, assignee_id })
    })
    await fetchData()
  }

  const onCreateUser = async (name)=>{
    await fetch(`${API_BASE}/users`,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    await fetchData()
  }

  return (
    <div className="app">
      <header>
        <h1>Kanban — FastAPI</h1>
      </header>
      <main>
        {loading ? <p>Загрузка...</p> : (
          <Board users={users} tasks={tasks} onMoveTask={onMoveTask} onCreateTask={onCreateTask} onCreateUser={onCreateUser} />
        )}
      </main>
    </div>
  )
}
