// SIMPLE EXPLANATION: This file adds missing browser features to Node.js for testing
// Some libraries expect these to exist, but they're not available in Node.js by default

const { TextEncoder, TextDecoder } = require('util');

// Add TextEncoder and TextDecoder (needed for crypto libraries)
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Add crypto.getRandomValues (needed for UUID generation)
const crypto = require('crypto');

// Ensure self exists (some libraries expect it)
if (typeof global.self === 'undefined') {
  global.self = global;
}

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: (arr) => crypto.randomBytes(arr.length),
  },
});

// Add Request and Response for Next.js API routes
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(input, init = {}) {
      this.url = input;
      this.method = init.method || 'GET';
      this.headers = new Map(Object.entries(init.headers || {}));
      this.body = init.body;
    }

    async json() {
      return JSON.parse(this.body || '{}');
    }

    async text() {
      return this.body || '';
    }
  };
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init = {}) {
      this.body = body;
      this.status = init.status || 200;
      this.statusText = init.statusText || 'OK';
      this.headers = new Map(Object.entries(init.headers || {}));
    }

    async json() {
      return JSON.parse(this.body || '{}');
    }

    async text() {
      return this.body || '';
    }

    static json(data, init = {}) {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...init.headers,
        },
      });
    }
  };
}

// Add Headers if missing
if (typeof global.Headers === 'undefined') {
  global.Headers = Map;
}
