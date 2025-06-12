"use client";

import { useState, useEffect } from 'react';
import { Task } from '../types/task';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';
import { TrashIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError("Failed to fetch tasks");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    setIsLoading(true);
    try {
      const newTask = await createTask({
        title: newTaskTitle,
        completed: false,
      });
      setTasks(prev => [...prev, newTask]);
      setNewTaskTitle('');
      toast.success('Tarefa criada com sucesso!');
    } catch (err) {
      setError('Failed to create task');
      toast.error('Erro ao criar tarefa');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    if (task.id === undefined) return;
    
    try {
      const updatedTask = await updateTask(task.id, {
        completed: !task.completed,
      });
      setTasks(prev => prev.map(t => 
        t.id === task.id ? updatedTask : t
      ));
      
      if (updatedTask.completed) {
        toast.success(
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500" />
            Tarefa concluída!
          </div>
        );
      } else {
        toast.info('Tarefa marcada como não concluída');
      }
    } catch (err) {
      setError('Failed to update task');
      toast.error('Erro ao atualizar tarefa');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success(
        <div className="flex items-center">
          <TrashIcon className="h-5 w-5 mr-2 text-red-500" />
          Tarefa removida com sucesso!
        </div>,
        {
          icon: false
        }
      );
    } catch (err) {
      setError('Failed to delete task');
      toast.error('Erro ao remover tarefa');
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Adicione o ToastContainer uma vez no componente */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="flex mb-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          placeholder="Add a new task"
          className="flex-1 p-2 border rounded-l"
          disabled={isLoading}
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isLoading || !newTaskTitle.trim()}
        >
          {isLoading ? 'Adding...' : 'Add'}
        </button>
      </div>
      
      {isLoading && tasks.length === 0 ? (
        <div>Loading tasks...</div>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`p-3 border rounded flex items-center justify-between ${
                task.completed ? 'bg-gray-100' : ''
              }`}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed || false}
                  onChange={() => handleToggleComplete(task)}
                  className="mr-2 h-5 w-5"
                  disabled={isLoading}
                />
                <span
                  className={`${
                    task.completed ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {task.title}
                </span>
              </div>
              <button
                onClick={() => task.id && handleDelete(task.id)}
                className="text-red-500 hover:text-red-700"
                disabled={isLoading}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}