import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

export const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

export const createTask = async (task: { title: string; completed: boolean }) => {
  const response = await api.post('/tasks', { task });
  return response.data;
};

export const updateTask = async (id: number, task: { title?: string; completed?: boolean }) => {
  const response = await api.patch(`/tasks/${id}`, { task });
  return response.data;
};

export const deleteTask = async (id: number) => {
  await api.delete(`/tasks/${id}`);
};