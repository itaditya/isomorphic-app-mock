import '../bootstrap';
import { useEffect, useState } from 'react';

const Home = (props) => {
  const { user } = props;
  const [stateTodos, setStateTodos] = useState(null);

  useEffect(() => {
    (async function() {
      const resTodos = await fetch('/api/todos');
      const todos = await resTodos.json();

      setStateTodos(todos);
    })();
  }, []);

  return (
    <div>
      <h1>{user.name}'s Todos</h1>
      <ul>
        {
          stateTodos
            ? (
              stateTodos.map(todo => (
                <li key={todo}>{todo}</li>
              ))
            )
            : 'Loading...'
        }
      </ul>
    </div>
  );
}

Home.getInitialProps = async function() {
  const resUser = await fetch('https://jsonplaceholder.typicode.com/users/1');
  const user = await resUser.json();

  return {
    user,
  };
};

export default Home
