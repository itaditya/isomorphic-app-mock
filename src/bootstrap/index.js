import { init } from '../utils/mofetch';

const fetchConfig = {
  baseUrl: 'http://localhost:3000',
  mocks: {
    '/api/todos': {
      data: require('../fixtures/api/todos.json'),
      delay: 800,
      shouldReject: false,
      statusCode: 200,
      itemFinder: (item, params) => {
        return item.id === params[0];
      },
    },
    '/api/users/1': {
      data: {
        name: 'Aditya Agarwal',
      },
    },
    '/api/users': {
      data: [
        {
          name: 'Aditya Agarwal',
        },
        {
          name: 'Andy Bernard',
        },
      ],
    },
    '/api/preferences': {
      data: {
        theme: 'dark',
      },
    },
  },
};

init(fetchConfig);
