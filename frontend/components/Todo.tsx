import { useEffect, useState } from "react";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "../utils/api";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    async function loadTodos() {
      const data = await fetchTodos();
      setTodos(data);
    }
    loadTodos();
  }, []);

  const handleAdd = async () => {
    if (title.trim() === "") return;
    const newTodo = await addTodo(title);
    setTodos([...todos, newTodo]);
    setTitle("");
  };

  const handleToggle = async (id: number, completed: boolean) => {
    await updateTodo(id, !completed);
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !completed } : todo));
  };

  const handleDelete = async (id: number) => {
    await deleteTodo(id);
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-white p-4">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">📝 To-Do List</h1>
        
        <div className="flex mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded-l bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-400"
            placeholder="Add a new task..."
          />
          <button 
            onClick={handleAdd} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r transition duration-200"
          >
            Add
          </button>
        </div>

        <ul>
          {todos.length === 0 ? (
            <p className="text-center text-gray-400">No tasks yet. Start adding!</p>
          ) : (
            todos.map(todo => (
              <li key={todo.id} className="flex justify-between items-center p-3 bg-gray-700 rounded mb-2 shadow">
                <span className={`flex-1 ${todo.completed ? "line-through text-gray-400" : ""}`}>
                  {todo.title}
                </span>
                <div>
                  <button 
                    onClick={() => handleToggle(todo.id, todo.completed)} 
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition duration-200 mx-1"
                  >
                    {todo.completed ? "Undo" : "Complete"}
                  </button>
                  <button 
                    onClick={() => handleDelete(todo.id)} 
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
