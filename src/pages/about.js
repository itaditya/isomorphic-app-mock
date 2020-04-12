import { fetch } from '../utils/mofetch';

const About = (props) => {
  return (
    <ul>
      {props.todos.map((todo) => (
        <li key={todo.id}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
};

About.getInitialProps = async function () {
  const resTodos = await fetch('/api/todos?a=b');
  const todos = await resTodos.json();

  return {
    todos,
  };
};

export default About;
