import nodeFetch from 'node-fetch';

const realFetch = process.browser ? window.fetch : nodeFetch;

const jsonMethodPromise = (data) => {
  return {
    json: () => Promise.resolve(data),
  }
}

const fakeFetch = (url, ...restArgs) => {
  const mock = fakeFetchConfig[url];

  if(!mock) {
    return realFetch(url, ...restArgs);
  }

  const mockData = mock.data;
  const mockDelay = mock.delay || 300;
  const mockReject = mock.shouldReject || false;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if(mockReject) {
        reject();
        return;
      }
      resolve(jsonMethodPromise(mockData));
    }, mockDelay);
  });
}

const fakeFetchConfig = {
  '/api/todos': {
    data: ['a', 'x', 'p'],
    delay: 800,
    shouldReject: false,
  },
  '/api/preferences': {
    data: {
      theme: 'dark',
    },
  },
};

global.fetch = fakeFetch;
// global.fetch = realFetch;  // comment this line to enable fake fetch.
