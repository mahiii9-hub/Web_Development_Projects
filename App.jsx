import React, { useState, useEffect } from 'react';

const API_BASE_URL = "http://localhost:5000/api/tasks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Web Dev');

  const [filterPriority, setFilterPriority] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
   try {
const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
        localStorage.setItem('cached_tasks', JSON.stringify(data));
      } else {
        throw new Error('API unavailable');
      }
    } catch (err) {
      const cached = localStorage.getItem('cached_tasks');
      if (cached) setTasks(JSON.parse(cached));
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    const newTaskData = { title, dueDate, priority, category, isCompleted: false };

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskData)
      });
      if (response.ok) {
        const savedTask = await response.json();
        const updated = [...tasks, savedTask];
        setTasks(updated);
        localStorage.setItem('cached_tasks', JSON.stringify(updated));
      } else {
        throw new Error('API Error');
      }
    } catch (err) {
      const mockTask = { ...newTaskData, _id: Date.now().toString() };
      const updated = [...tasks, mockTask];
      setTasks(updated);
      localStorage.setItem('cached_tasks', JSON.stringify(updated));
    }

    setTitle('');
    setDueDate('');
  };

  const toggleComplete = async (task) => {
    const updatedStatus = !task.isCompleted;
    try {
      await fetch(`${API_BASE_URL}/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: updatedStatus })
      });
    } catch (err) {
      console.log('Offline mode toggle');
    }

    const updatedTasks = tasks.map(t => t._id === task._id ? { ...t, isCompleted: updatedStatus } : t);
    setTasks(updatedTasks);
    localStorage.setItem('cached_tasks', JSON.stringify(updatedTasks));
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.log('Offline mode delete');
    }

    const updatedTasks = tasks.filter(t => t._id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('cached_tasks', JSON.stringify(updatedTasks));
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const filteredTasks = tasks.filter(task => {
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    const matchesCategory = filterCategory === 'All' || task.category === filterCategory;
    return matchesPriority && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl shadow-lg">
          <div>
            <h1 className="text-2xl font-bold">Task & Event Dashboard</h1>
            <p className="text-blue-100 text-sm">Code Bridge Community Management Portal</p>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg text-right">
            <span className="block text-xs uppercase font-semibold">Progress</span>
            <span className="text-xl font-extrabold">{progressPercent}%</span>
          </div>
        </header>

        {/* Dynamic Progress Bar */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="flex justify-between text-sm mb-2 text-slate-300">
            <span>Overall Task Completion</span>
            <span>{completedTasks} / {totalTasks} Completed</span>
          </div>
          <div className="w-full bg-slate-700 h-4 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Create Task Form */}
        <form onSubmit={handleAddTask} className="bg-slate-800 p-6 rounded-xl border border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Task Title..." 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
            required 
          />
          <input 
            type="date" 
            value={dueDate} 
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
            required 
          />
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="Web Dev">Web Dev</option>
            <option value="Exams">Exams</option>
            <option value="Personal">Personal</option>
          </select>
          <button 
            type="submit" 
            className="md:col-span-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 py-3 rounded-lg font-bold transition"
          >
            Add New Task
          </button>
        </form>

        {/* Filtering Controls */}
        <div className="flex flex-wrap gap-4 justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-slate-400">Priority:</span>
            {['All', 'High', 'Medium', 'Low'].map(p => (
              <button 
                key={p} 
                type="button"
                onClick={() => setFilterPriority(p)}
                className={`px-3 py-1 rounded-md text-sm ${filterPriority === p ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'}`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-slate-400">Category:</span>
            {['All', 'Web Dev', 'Exams', 'Personal'].map(c => (
              <button 
                key={c} 
                type="button"
                onClick={() => setFilterCategory(c)}
                className={`px-3 py-1 rounded-md text-sm ${filterCategory === c ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Task List Render */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <p className="text-center text-slate-500 py-6">No tasks available.</p>
          ) : (
            filteredTasks.map(task => (
              <div 
                key={task._id} 
                className={`flex items-center justify-between p-4 rounded-xl border transition ${task.isCompleted ? 'bg-slate-900/50 border-slate-800 opacity-60' : 'bg-slate-800 border-slate-700'}`}
              >
                <div className="flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    checked={task.isCompleted} 
                    onChange={() => toggleComplete(task)}
                    className="w-5 h-5 accent-purple-600 cursor-pointer"
                  />
                  <div>
                    <h3 className={`font-semibold ${task.isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                      {task.title}
                    </h3>
                    <div className="flex gap-2 text-xs mt-1">
                      <span className="text-slate-400">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      <span className="text-purple-400">#{task.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    task.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                    task.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {task.priority}
                  </span>
                  <button 
                    type="button"
                    onClick={() => deleteTask(task._id)}
                    className="text-red-400 hover:text-red-300 text-sm font-semibold p-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
