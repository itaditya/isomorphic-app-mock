import { init } from '../utils/mofetch';

const fetchConfig = {
  baseUrl: 'http://localhost:3000',
  mocks: {
    '/api/todos': {
      data: require('../fixtures/api/todos.json'),
      delay: 800,
      shouldReject: false,
      statusCode: 200,
    },
    '/api/users/1': {
      data: {
        name: 'Aditya Agarwal',
      },
    },
    '/api/preferences': {
      data: {
        theme: 'dark',
      },
    },
  },
};

init(fetchConfig);
