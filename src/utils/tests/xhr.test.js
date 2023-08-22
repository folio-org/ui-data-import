import {
  getXHRErrorMessage,
  xhrAddHeaders,
} from '../xhr';

describe('xhrAddHeaders function', () => {
  it('adds headers to specified request object', () => {
    const fakeXhr = {
      headers: {},
      setRequestHeader(key, value) {
        this.headers[key] = value;
      },
    };
    const headers = { 'Content-Type': 'application/json' };

    xhrAddHeaders(fakeXhr, headers);

    expect(fakeXhr.headers['Content-Type']).toBe('application/json');
  });
});

describe('getXHRErrorMessage', () => {
  it('returns XMLHttpRequest errors', async () => {
    const fakeXmlResponse = {
      headers: new Map([['Content-Type', 'application/json']]),
      json: async () => ({ errors: [new Error('Xhr error')] }),
    };

    expect(await getXHRErrorMessage(fakeXmlResponse)).toBe('Xhr error');
  });

  describe('when response type is text/plain', () => {
    it('should return correct response text', async () => {
      const fakeXmlResponse = {
        headers: new Map([['Content-Type', 'text/plain']]),
        text: async () => 'text/plain response',
      };

      expect(await getXHRErrorMessage(fakeXmlResponse)).toBe('text/plain response');
    });
  });
});
