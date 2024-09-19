import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {

    axios.get('/api/tasks').then(response => setTasks(response.data));
  }, []);

  const addTask = () => {
    axios.post('/api/tasks', { text: newTask })
      .then(response => setTasks([...tasks, response.data]));
    setNewTask('');
  };

  const markCompleted = (id) => {
    axios.patch(`/api/tasks/${id}`, { completed: true })
      .then(() => setTasks(tasks.map(task =>
        task._id === id ? { ...task, completed: true } : task
      )));
  };

  const deleteTask = (id) => {
    axios.delete(`/api/tasks/${id}`)
      .then(() => setTasks(tasks.filter(task => task._id !== id)));
  };

  const startEdit = (task) => {
    setEditingTask(task);
    setEditText(task.text);
  };

  const updateTask = () => {
    axios.put(`/api/tasks/${editingTask._id}`, { text: editText })
      .then(() => {
        setTasks(tasks.map(task =>
          task._id === editingTask._id ? { ...task, text: editText } : task
        ));
        setEditingTask(null);
        setEditText('');
      });
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add new task"
      />
      <button onClick={addTask}>Add Task</button>
      
      {editingTask && (
        <div>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <button onClick={updateTask}>Update Task</button>
        </div>
      )}
      
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.text}
            </span>
            <button onClick={() => markCompleted(task._id)}>Complete</button>
            <button onClick={() => startEdit(task)}>Edit</button>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
