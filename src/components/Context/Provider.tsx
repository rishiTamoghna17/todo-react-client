import React, { useReducer, createContext, useEffect } from "react";

// Define types for state and actions
interface State {
  todos: Todo[];
  id: number;
  subtaskId: number;
  user: UserData | null;
}

export interface Todo {
  text: string;
  id: number;
  completed: boolean;
  subtasks: Subtask[];
}

interface Subtask {
  id: number;
  text: string;
  completed: boolean;
}

export interface UserData {
  id: number;
  name: string;
  password: string;
  email: string;
  token: string;
}

type Action =
  | { type: "SET_TODOS"; payload: Todo[] }
  | { type: "ADD_TODO"; payload: string }
  | { type: "ADD_SUBTASK"; payload: { taskId: number; subtaskText: string } }
  | { type: "DELETE_TODO"; payload: number }
  | { type: "DELETE_SUBTASK"; payload: { taskId: number; subtaskId: number } }
  | { type: "CLEAR_TODOS" }
  | { type: "TOGGLE_TODO_COMPLETED"; payload: { id: number } }
  | {
      type: "TOGGLE_SUBTASK_COMPLETED";
      payload: { taskId: number; subtaskId: number };
    }
  | { type: "LOGIN"; payload: UserData }
  | { type: "LOGOUT" };

const initialState: State = {
  todos: [],
  id: 0,
  subtaskId: 0,
  user: null
};

const todosReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_TODOS":
      return {
        ...state,
        todos: action.payload
      };
    case "ADD_TODO":
      const newTodo: Todo = {
        text: action.payload,
        id: state.id,
        completed: false,
        subtasks: []
      };
      return {
        ...state,
        todos: [...state.todos, newTodo],
        id: state.id + 1
      };
    case "ADD_SUBTASK":
      const { taskId: addTaskId, subtaskText } = action.payload;
      const updatedTodosAddSubtask: Todo[] = state.todos.map((todo) => {
        if (todo.id === addTaskId) {
          const subtask: Subtask = {
            id: state.subtaskId,
            text: subtaskText,
            completed: false
          };
          return {
            ...todo,
            subtasks: [...todo.subtasks, subtask]
          };
        }
        return todo;
      });
      return {
        ...state,
        todos: updatedTodosAddSubtask,
        subtaskId: state.subtaskId + 1
      };
    case "DELETE_TODO":
      const updatedTodosDeleteTodo: Todo[] = state.todos.filter(
        (todo) => todo.id !== action.payload
      );
      return {
        ...state,
        todos: updatedTodosDeleteTodo
      };
    case "DELETE_SUBTASK":
      const { taskId: deleteTaskId, subtaskId: deleteSubtaskId } = action.payload;
      const updatedTodosDeleteSubtask: Todo[] = state.todos.map((todo) => {
        if (todo.id === deleteTaskId) {
          const updatedSubtasks: Subtask[] = todo.subtasks.filter(
            (subtask) => subtask.id !== deleteSubtaskId
          );
          return {
            ...todo,
            subtasks: updatedSubtasks
          };
        }
        return todo;
      });
      return {
        ...state,
        todos: updatedTodosDeleteSubtask
      };
    case "CLEAR_TODOS":
      return {
        ...state,
        todos: []
      };
    case "TOGGLE_TODO_COMPLETED":
      const updatedTodosToggleTodo: Todo[] = state.todos.map((todo) => {
        if (todo.id === action.payload.id) {
          return {
            ...todo,
            completed: !todo.completed
          };
        }
        return todo;
      });
      return {
        ...state,
        todos: updatedTodosToggleTodo
      };
    case "TOGGLE_SUBTASK_COMPLETED":
      const { taskId: toggleTaskId, subtaskId: toggleSubtaskId } = action.payload;
      const updatedTodosToggleSubtask: Todo[] = state.todos.map((todo) => {
        if (todo.id === toggleTaskId) {
          const updatedSubtasks: Subtask[] = todo.subtasks.map((subtask) => {
            if (subtask.id === toggleSubtaskId) {
              return {
                ...subtask,
                completed: !subtask.completed
              };
            }
            return subtask;
          });
          return {
            ...todo,
            subtasks: updatedSubtasks
          };
        }
        return todo;
      });
      return {
        ...state,
        todos: updatedTodosToggleSubtask
      };
    case "LOGIN":
      return {
        ...state,
        user: action.payload
      };
    case "LOGOUT":
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
};

interface ContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
  login: (userData: UserData) => void;
  logout: () => void;
}

const context = createContext<ContextValue>({
  state: initialState,
  dispatch: () => {},
  login: () => {},
  logout: () => {}
});

export default function Provider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(todosReducer, initialState);

  useEffect(() => {
    const todos = window.localStorage.getItem("todos");
    const parsedTodos = todos ? JSON.parse(todos) : [];
    dispatch({ type: "SET_TODOS", payload: parsedTodos });
  }, []);

  useEffect(() => {
    window.localStorage.setItem("todos", JSON.stringify(state.todos));
  }, [state.todos]);

  const login = (userData: UserData) => {
    dispatch({ type: "LOGIN", payload: userData });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const value: ContextValue = {
    state,
    dispatch,
    login,
    logout
  };

  return <context.Provider value={value}>{children}</context.Provider>;
}

export { context };
