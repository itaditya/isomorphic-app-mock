function logger(string) {
  console.log(`[mofetch] ${string}`);
}

function loggerAPI({ method, url }) {
  logger(`${method}: ${url}`);
}

const mockConfig = {
  baseUrl: '',
  isInitialized: false,
  delay: process.env.NODE_ENV === 'development' ? 400 : 0,
};

let router;

function getStoredUrl(url, method) {
  return `${method}:${url}`;
}

const mocker = {
  handle(url, method, handler, config = {}) {
    const storedUrl = getStoredUrl(url, method);
    if(!router) {
      throw new Error('You have to enable mocking by setting mockFetch to true');
    }
    router.add(storedUrl, {
      handler,
      config,
    });
  },
  get(url, handler, config) {
    mocker.handle(url, 'GET', handler, config);
  },
  post(url, handler, config) {
    mocker.handle(url, 'POST', handler, config);
  },
  put(url, handler, config) {
    mocker.handle(url, 'PUT', handler, config);
  },
  patch(url, handler, config) {
    mocker.handle(url, 'PATCH', handler, config);
  },
  delete(url, handler, config) {
    mocker.handle(url, 'DELETE', handler, config);
  },
  all(url, handler, config) {
    mocker.handle(url, '*', handler, config);
  },
};

function serverFetch(url, ...restArgs) {
  const nodeFetch = require('node-fetch');
  const actualUrl = mockConfig.baseUrl + url;
  return nodeFetch(actualUrl, ...restArgs);
}

const realFetch = typeof window === 'undefined' ? serverFetch : window.fetch;

function getUrlData(url, method) {
  const fromEntries = Object.fromEntries || require('object.fromentries');
  const actualUrl = url.split(/[?#]/)[0];

  const parsedUrl = new URL(mockConfig.baseUrl + url);
  const query = fromEntries(parsedUrl.searchParams.entries());
  const storedUrl = getStoredUrl(actualUrl, method);

  return { storedUrl, query };
}

function getMockHandler(url, method) {
  const { storedUrl, query } = getUrlData(url, method);
  const routeData = router.find(storedUrl);
  if (!routeData) {
    return {};
  }
  const { handler: handlerData, params } = routeData;
  const { handler, config } = handlerData;
  return { handler, config, query, params };
}

const fakeFetch = async (url, options = {}) => {
  const method = options.method || 'GET';
  const { handler, config, query, params } = getMockHandler(url, method);

  if (!handler) {
    return realFetch(url, options);
  }

  loggerAPI({ method, url });

  return new Promise((resolve, reject) => {
    function send() {
      try {
        const isFunction = typeof handler === 'function';
        const { status, data } = isFunction ? handler({ query, params, options }) : handler;
        resolve({
          status: status,
          ok: status < 400,
          json: () => Promise.resolve(data),
        });
      } catch (error) {
        reject(error);
      }
    }

    const delay = config.delay || mockConfig.delay;
    setTimeout(send, delay);
  });
};

export function init(config) {
  if (config.mockFetch) {
    const routerImport = require('url-router');
    const Router = typeof window === 'undefined' ? routerImport : routerImport.default;
    router = new Router();
  }
  Object.assign(mockConfig, config, {
    isInitialized: true,
  });
  return mocker;
}

export function fetch(...restArgs) {
  if (!mockConfig.isInitialized) {
    throw new Error('Call init() in your app before using fetch.');
  }
  return mockConfig.mockFetch ? fakeFetch(...restArgs) : realFetch(...restArgs);
}
