import { fetch } from '../utils/mofetch';

const About = (props) => {
  return (
    <ul>
      {props.todos.map((todo) => (
        <li key={todo.id}>
          <span>{todo.id} -> </span>
          <span>{todo.text}</span>
        </li>
      ))}
    </ul>
  );
};

About.getInitialProps = async function () {
  const resTodos = await fetch('/api/todos');
  const todos = await resTodos.json();

  return {
    todos,
  };
};

export default About;
