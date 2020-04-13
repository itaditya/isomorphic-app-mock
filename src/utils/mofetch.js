let fetchConfig, mockedUrls;

function logger(string) {
  console.log(`[mofetch] ${string}`);
}

const apiCache = {};

function serverFetch(url, ...restArgs) {
  const nodeFetch = require('node-fetch');
  const actualUrl = fetchConfig.baseUrl + url;
  return nodeFetch(actualUrl, ...restArgs);
}

const realFetch = typeof window === 'undefined' ? serverFetch : window.fetch;

function applyUpdates(url, options, mock) {
  const itemFinder = (item) => mock.itemFinder(item, mock.params);
  const data = apiCache[url];
  if (options.method === 'POST') {
    const body = JSON.parse(options.body);
    const newData = [...data, body];
    apiCache[url] = newData;
    return;
  }

  if (options.method === 'PUT' || options.method === 'PATCH') {
    const itemIndex = data.findIndex(itemFinder);
    const item = data[itemIndex];
    const body = JSON.parse(options.body);
    const newItem = options.method === 'PUT' ? body : {
      ...item,
      ...body,
    };

    data.splice(itemIndex, 1, newItem);
    apiCache[url] = data;
    return;
  }

  if (options.method === 'DELETE') {
    const itemIndex = data.findIndex(itemFinder);
    data.splice(itemIndex, 1);
    apiCache[url] = data;
    return;
  }
}

function getMock(url) {
  const key = mockedUrls.find(mockUrl => url.startsWith(mockUrl));
  const paramString = url.replace(key, '');
  const [_, ...params] = paramString.split('/');

  fetchConfig.mocks[key].params = params;
  return fetchConfig.mocks[key];
}

const fakeFetch = async (url, options = {}) => {
  logger(`${options.method || 'GET'}: ${url}`);
  const actualUrl = url.split(/[?#]/)[0];
  const mock = getMock(actualUrl);

  if (!mock) {
    return realFetch(url, options);
  }

  if (!apiCache[actualUrl]) {
    apiCache[actualUrl] = mock.data;
  }

  applyUpdates(actualUrl, options, mock);

  const mockData = apiCache[actualUrl];
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
  mockedUrls = Object.keys(fetchConfig.mocks);
}

export function fetch(...restArgs) {
  return process.env.MOCK_FETCH ? fakeFetch(...restArgs) : realFetch(...restArgs);
}
