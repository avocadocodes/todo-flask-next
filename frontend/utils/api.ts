import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/todos`;


export const fetchTodos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addTodo = async (title: string) => {
  const response = await axios.post(API_URL, { title });
  return response.data;
};

export const updateTodo = async (id: number, completed: boolean) => {
  const response = await axios.put(`${API_URL}/${id}`, { completed });
  return response.data;
};

export const deleteTodo = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
