import axios from "axios";
import React, { useState, useEffect } from "react";

function Home() {
  const [todo, setTodo] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  // 📌 Fetch all todos when the component loads
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/todo/fetch", {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        setTodo(response.data.todos); // सही तरीके से todos सेट करें
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const todoCreate = async () => {
    if (!newTodo) return;
    try {
      const response = await axios.post(
        "http://localhost:8080/todo/create",
        { text: newTodo, completed: false },
        { withCredentials: true }
      );

      console.log("API Response:", response.data); // Debugging

      if (!response.data || !response.data.newtodo) {
        throw new Error("Invalid response from server");
      }

      // ✅ Correct key used (response.data.newtodo)
      setTodo((prevTodos) => [...prevTodos, response.data.newtodo]);

      setNewTodo(""); // Clear input field
    } catch (err) {
      setError(err.message);
    }
  };

  // 📌 Toggle todo status (Complete / Incomplete)
  const todoSattus = async (id) => {
    try {
      setTodo((prevTodos) =>
        prevTodos.map((t) =>
          t._id === id ? { ...t, completed: !t.completed } : t
        )
      );
      await axios.put(
        `http://localhost:8080/todo/update/${id}`,
        { completed: !todo.find((t) => t._id === id).completed },
        { withCredentials: true }
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // 📌 Delete a todo
  const todoDelete = async (id) => {
    try {
      setTodo((prevTodos) => prevTodos.filter((t) => t._id !== id));
      await axios.delete(`http://localhost:8080/todo/delete/${id}`, {
        withCredentials: true,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:8080/user/logout");
      toast.success("Logged Out Successfully");
    } catch (err) {
      toast.error("Failed to Logout");
    }
  };
  const remainingTodos = todo.filter((t) => !t.completed).length;

  return (
    <div className="bg-gray-100 max-w-lg lg:max-w-xl rounded-lg shadow-lg mx-8 sm:mx-auto p-4 mt-4">
      <h1 className="text-3xl font-semibold text-center mb-2 text-blue-700">
        Todo App
      </h1>

      {/* 📌 Input for adding a new todo */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Add a todo"
          className="flex-grow p-2 border rounded-md focus:outline-none text-red-700"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && todoCreate()}
        />
        <button
          className="bg-blue-600 border rounded-md text-white hover:bg-blue-800 duration-300 ease-out text-sm px-2"
          onClick={todoCreate}>
          Add Todo
        </button>
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* 📌 Displaying Todos */}
      <ul className="space-y-1">
        {todo.map((todos) => (
          <li
            className="flex items-center justify-between px-2 py-1 bg-gray-100"
            key={todos._id}>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={todos.completed}
                onChange={() => todoSattus(todos._id)}
              />
              <span
                className={`text-gray-800 ${
                  todos.completed
                    ? " font-semibold line-through decoration-gray-600"
                    : ""
                }`}>
                {todos.text}
              </span>
            </div>
            <button
              className="text-red-500 hover:text-red-800 duration-300"
              onClick={() => todoDelete(todos._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <p className="text-center">{remainingTodos} remaining todos</p>
      <button
        className="mt-5 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 duration-300 mx-auto block"
        onClick={() => logout()}>
        Logout
      </button>
    </div>
  );
}

export default Home;
