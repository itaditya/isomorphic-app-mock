import { init } from '../utils/mofetch';

const mocker = init({
  baseUrl: 'http://localhost:3000',
});

mocker.get('/api/todos', {
  status: 200,
  data: require('../fixtures/api/todos.json'),
}, {
  delay: 800,
});

mocker.post('/api/todos', {
  status: 200,
  data: [],
});

mocker.get('/api/users/:id', function handler({ query, params }) {
  const prefix = query.prefix || 'Mocked';
  return {
    status: 200,
    data: {
      name: `${prefix} User ${params.id}`,
    },
  };
});

mocker.get('/api/users', {
  status: 200,
  data: [
    {
      id: 1,
      name: 'Mocked User 1',
    },
    {
      id: 2,
      name: 'Mocked User 2',
    },
  ],
});
