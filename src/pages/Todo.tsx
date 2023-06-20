import * as React from "react";
import "./Todo.css";
import TodoList from "../components/Todo/TodoList";
import NewTodo from "../components/Todo/NewTodo";

export default function Todo() {
  return (
    <>
      <div className="bucket">
        <TodoList />
        <NewTodo />
      </div>
    </>
  );
}
