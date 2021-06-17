import Todo from "./Todo";

function Todos({ todos, deleteTodo }) {
  return (
    <section>
      <ul id="todosList">
        {todos.map((todo) => (
          <Todo key={todo.id} todo={todo} deleteTodo={deleteTodo} />
        ))}
      </ul>
    </section>
  );
}
export default Todos;
