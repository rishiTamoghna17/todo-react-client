import React, {
  useState,
  useContext,
  useEffect,
  ChangeEvent,
  FormEvent
} from "react";
import { useNavigate } from "react-router-dom";
import { Todo, context } from "../Context/Provider";
import "./NewTodo.css";

export default function NewTodo() {
  const [todo, setTodo] = useState<string>("");
  const [subtask, setSubtask] = useState<string>("");
  const { state, dispatch } = useContext(context);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
    console.log(state.user);
  }, [state.user, token, navigate]);

  function handleSubmit(event: FormEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (todo.trim() !== "") {
      dispatch({ type: "ADD_TODO", payload: todo });
      setTodo("");
    }
  }

  function handleSubtaskCreate(parentTodo: Todo) {
    dispatch({
      type: "ADD_SUBTASK",
      payload: { taskId: parentTodo.id, subtaskText: subtask }
    });
    setSubtask("");
  }

  function handleKeyDown(event: any) {
    if (event.keyCode === 13) {
      handleSubmit(event);
    }
  }

  return (
    <>
      <div className="new-todo">
        <input
          type="text"
          value={todo}
          placeholder="Enter task"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTodo(e.target.value)
          }
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSubmit}>Add Task</button>
        <form
          className="subtask-form"
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            handleSubtaskCreate(state.todos[state.todos.length - 1]);
          }}
        ></form>
      </div>
    </>
  );
}
