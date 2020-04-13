import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetch } from '../utils/mofetch';

const Home = (props) => {
  const { user } = props;
  const [stateApiStatus, setStateApiStatus] = useState('loading');
  const [stateTodos, setStateTodos] = useState([]);

  async function deleteTodo(id) {
    setStateTodos(oldTodos => {
      return oldTodos.filter(item => item.id !== id);
    });
    await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });
  }

  async function editTodo(id) {
    setStateTodos(oldTodos => {
      const itemIndex = oldTodos.findIndex(item => item.id === id);
      const newTodos = [...oldTodos];
      newTodos.splice(itemIndex, 1, {
        id,
        text: 'updated',
      });
      return newTodos;
    });
    await fetch(`/api/todos/${id}/edit`, {
      method: 'PATCH',
      body: JSON.stringify({ text: 'updated' }),
    });
  }

  async function addTodo() {
    const n = Math.random() + '';
    const newTodo = {
      id: n,
      text: `Todo ${n}`
    };

    setStateTodos(oldTodos => {
      return [...oldTodos, newTodo];
    });
    await fetch(`/api/todos`, {
      method: 'POST',
      body: JSON.stringify(newTodo),
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
              <li key={todo.id}>
                <span>{todo.id} -> </span>
                <span>
                  {todo.text}
                </span>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                <button onClick={() => editTodo(todo.id)}>Edit</button>
              </li>
            ))}
      </ul>
      <button onClick={addTodo}>Add</button>
      <br />
      <Link href="/about">
        <a>
          About
        </a>
      </Link>
      <br />
      <Link href="/users">
        <a>
          Users
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
