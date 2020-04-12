import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetch } from '../utils/mofetch';

const Home = (props) => {
  const { user } = props;
  const [stateApiStatus, setStateApiStatus] = useState('loading');
  const [stateTodos, setStateTodos] = useState([]);

  async function deleteTodo(id) {
    const resTodos = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });

    setStateTodos(oldTodos => {
      const newList = oldTodos.filter(item => item.id !== id);
      return newList;
    });
  }

  useEffect(() => {
    (async function () {
      try {
        const resTodos = await fetch('/api/todos?a=b');
        if (!resTodos.ok) {
          throw new Error('API failed');
        }
        const todos = await resTodos.json();
        setStateTodos(todos);
        setStateApiStatus('success');
      } catch (error) {
        console.log(error);
        setStateApiStatus('failed');
      }
    })();
  }, []);

  return (
    <div>
      <h1>{user.name}'s Todos</h1>
      <ul>
        {stateApiStatus === 'loading'
          ? 'Loading...'
          : stateApiStatus === 'failed'
          ? 'Failed !'
          : stateTodos.map((todo) => (
              <li key={todo.id} onClick={() => deleteTodo(todo.id)}>
                {todo.text}
              </li>
            ))}
      </ul>
      <Link href="/about">
        <a>
          About
        </a>
      </Link>
    </div>
  );
};

Home.getInitialProps = async function () {
  const resUser = await fetch('/api/users/1');
  const user = await resUser.json();

  return {
    user,
  };
};

export default Home;
