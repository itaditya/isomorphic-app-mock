let fetchConfig;

function serverFetch(url, ...restArgs) {
  const nodeFetch = require('node-fetch');
  const actualUrl = fetchConfig.baseUrl + url;
  return nodeFetch(actualUrl, ...restArgs);
}

const realFetch = typeof window === 'undefined' ? serverFetch : window.fetch;

const fakeFetch = async (url, options = {}) => {
  const actualUrl = url.split(/[?#]/)[0];
  const mock = fetchConfig.mocks[actualUrl];

  if (!mock) {
    return realFetch(url, options);
  }

  const mockData = mock.data;
  const mockDelay = mock.delay || 300;
  const mockShouldReject = mock.shouldReject ?? false;
  const mockStatusCode = mock.statusCode || 200;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockShouldReject) {
        reject('Network request failed');
        return;
      }
      resolve({
        status: mockStatusCode,
        ok: mockStatusCode < 400,
        json: () => Promise.resolve(mockData),
      });
    }, mockDelay);
  });
};

export function init(config) {
  fetchConfig = config;
}

export function fetch(...restArgs) {
  return process.env.MOCK_FETCH ? fakeFetch(...restArgs) : realFetch(...restArgs);
}
