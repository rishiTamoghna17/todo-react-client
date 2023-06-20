import React, { useContext, useEffect, useState } from "react";
import { context, Todo } from "../Context/Provider";
import { useNavigate } from "react-router-dom";
import "./TodoList.css"; // Assuming you have a separate CSS file for styling
import NavBar from "../Navbar/Navbar";

export default function TodoList() {
  const { state, dispatch } = useContext(context);
  const [subtaskText, setSubtaskText] = useState("");
  const [expandedTodos, setExpandedTodos] = useState<number[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [showSubtaskForm, setShowSubtaskForm] = useState<{ [key: number]: boolean }>(
    {}
  );

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!state.user && !token) navigate("/login");
  }, [state.user, token, navigate]);

  function handleDelete(todo: Todo) {
    dispatch({ type: "DELETE_TODO", payload: todo.id });
  }

  function handleCheckboxClick(todo: Todo) {
    dispatch({ type: "TOGGLE_TODO_COMPLETED", payload: { id: todo.id } });
  }

  function handleSubtaskCreate(todo: Todo) {
    if (subtaskText.trim() ==="") {
      return;
    }
    dispatch({
      type: "ADD_SUBTASK",
      payload: { taskId: todo.id, subtaskText }
    });
    setSubtaskText("");
    setShowSubtaskForm((prevShowSubtaskForm) => ({
      ...prevShowSubtaskForm,
      [todo.id]: false
    }));
  }

  function handleSubtaskDelete(todo: Todo, subtaskId: number) {
    dispatch({
      type: "DELETE_SUBTASK",
      payload: { taskId: todo.id, subtaskId }
    });
  }

  function handleSubtaskCheckboxClick(todo: Todo, subtaskId: number) {
    const payload = { taskId: todo.id, subtaskId };
    dispatch({ type: "TOGGLE_SUBTASK_COMPLETED", payload });
  }

  function handleSubtaskFormToggle(todo: Todo) {
    setShowSubtaskForm((prevShowSubtaskForm) => ({
      ...prevShowSubtaskForm,
      [todo.id]: !prevShowSubtaskForm[todo.id]
    }));
    
  }

  function handleTodoToggle(todo: Todo) {
    if (expandedTodos.includes(todo.id)) {
      setExpandedTodos((prevExpandedTodos) =>
        prevExpandedTodos.filter((id) => id !== todo.id)
      );
    } else {
      setExpandedTodos((prevExpandedTodos) => [...prevExpandedTodos, todo.id]);
    }
  }

  function handleClearButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    dispatch({ type: "CLEAR_TODOS" });
  }

  function getSubtaskCount(todo: Todo) {
    return todo.subtasks ? todo.subtasks.length : 0;
  }

  if (!state.todos) {
    return <div />;
  }

  return (
    <>
      <NavBar />
      <div className="accordion">
        <button className="clear-btc" onClick={handleClearButtonClick}>
          Clear items
        </button>
        <ul className="todo-list">
          {state.todos.map((todo: Todo) => {
            const isTodoSelected = selectedTodo && selectedTodo.id === todo.id;
            const isTodoExpanded = expandedTodos.includes(todo.id);
            const shouldShowSubtaskForm =
              showSubtaskForm[todo.id] || isTodoSelected;

            return (
              <li
                key={todo.id}
                className={`todo-list__item ${
                  isTodoSelected ? "selected" : ""
                }`}
                onClick={() => setSelectedTodo(todo)}
              >
                <span
                  className={`accordion-arrow ${
                    isTodoExpanded ? "expanded" : ""
                  }`}
                  onClick={() => handleTodoToggle(todo)}
                >
                  {isTodoExpanded ? "▼" : "▶"}
                </span>
                <span onClick={() => handleCheckboxClick(todo)}>
                  {todo.completed ? (
                    <span className="todo-list__item__completed" />
                  ) : (
                    <span className="todo-list__item__not-completed" />
                  )}
                </span>
                {todo.text}
                <span className="subtask-count">
                  {getSubtaskCount(todo)} Subtasks
                </span>
                <span
                  className="todo-list__item__delete-button"
                  onClick={() => handleDelete(todo)}
                >
                  X
                </span>
                {isTodoExpanded && (
                  <li className="subtask-container">
                    {shouldShowSubtaskForm && (
                      <>
                        {showSubtaskForm[todo.id] ? (
                          <form
                            className="subtask-form"
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleSubtaskCreate(todo);
                            }}
                          >
                            <input
                              type="text"
                              value={subtaskText}
                              onChange={(e) => setSubtaskText(e.target.value)}
                              placeholder="Enter subtask"
                              required
                            />
                            <button className="add-button" type="submit">
                              Add
                            </button>
                            <button
                              className="hide-form-button"
                              onClick={() => handleSubtaskFormToggle(todo)}
                            >
                              x
                            </button>
                          </form>
                        ) : null}
                        <button
                          className="hide-form-button"
                          onClick={() => handleSubtaskFormToggle(todo)}
                        >
                          {showSubtaskForm[todo.id]
                            ? ""
                            : "CLICK HERE TO ADD SUBTASK"}
                        </button>
                      </>
                    )}
                    {todo.subtasks && todo.subtasks.length > 0 && (
                      <ul className="subtask-list">
                        {todo.subtasks.map((subtask) => (
                          <li key={subtask.id}>
                            <label>
                              <input
                                type="checkbox"
                                checked={subtask.completed}
                                onChange={() =>
                                  handleSubtaskCheckboxClick(todo, subtask.id)
                                }
                              />
                              {subtask.text}
                            </label>
                            <span
                              className="subtask-delete-button"
                              onClick={() =>
                                handleSubtaskDelete(todo, subtask.id)
                              }
                            >
                              X
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
