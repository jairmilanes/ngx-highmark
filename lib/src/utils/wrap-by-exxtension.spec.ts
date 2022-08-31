import { wrapByExtension } from './wrap-by-extension';

describe('Utils: Wrap by extension', () => {
  it('should return src content without language tick when file extension is .md', () => {
    const mockSrc = './src-example/file.md';
    const mockResponse = 'response-x';

    expect(wrapByExtension(mockSrc, mockResponse)).toEqual(mockResponse);
  });

  it('should return src content without language tick when URL has no file extension', () => {
    const mockSrc = 'https://domain.com/file/path';
    const mockResponse = 'response-x';

    expect(wrapByExtension(mockSrc, mockResponse)).toEqual(mockResponse);
  });

  it('should ignore query parameters when resolving file extension', () => {
    const mockSrc = './src-example/file.js?param=123&another=abc';
    const mockResponse = 'response-x';

    expect(wrapByExtension(mockSrc, mockResponse)).toEqual('```js\n' + mockResponse + '\n```');
  });

  it('should return src content correctly when using different URL pattern', () => {
    const mockResponse = 'response-x';

    const useCases = [
      { url: 'https://domain.com/abc', extension: 'md' },
      { url: 'https://domain.com/abc.js', extension: 'js' },
      { url: 'https://domain.com/abc/def', extension: 'md' },
      { url: 'https://domain.com/abc/def/hij.ts', extension: 'ts' },
      { url: 'https://domain.com/abc/def/hij/jkl.tsx?mno=123', extension: 'tsx' },
      { url: 'https://domain.com/abc?def=123&hij=456', extension: 'md' },

      { url: 'http://domain.com/abc', extension: 'md' },
      { url: 'http://domain.com/abc.js', extension: 'js' },
      { url: 'http://domain.com/abc/def', extension: 'md' },
      { url: 'http://domain.com/abc/def/hij.ts', extension: 'ts' },
      { url: 'http://domain.com/abc/def/hij/jkl.tsx?mno=123', extension: 'tsx' },
      { url: 'http://domain.com/abc?def=123&hij=456', extension: 'md' },

      { url: './abc', extension: 'md' },
      { url: './abc.js', extension: 'js' },
      { url: './abc/def', extension: 'md' },
      { url: './abc/def/hij.ts', extension: 'ts' },
      { url: './abc/def/hij/jkl.tsx?mno=123', extension: 'tsx' },
      { url: './abc?def=123&hij=456', extension: 'md' },

      { url: '/abc', extension: 'md' },
      { url: '/abc.js', extension: 'js' },
      { url: '/abc/def', extension: 'md' },
      { url: '/abc/def/hij.ts', extension: 'ts' },
      { url: '/abc/def/hij/jkl.tsx?mno=123', extension: 'tsx' },
      { url: '/abc?def=123&hij=456', extension: 'md' },

      { url: 'abc/def', extension: 'md' },
      { url: 'abc/def/hij.ts', extension: 'ts' },
      { url: 'abc/def/hij/jkl.tsx?mno=123', extension: 'tsx' },
      { url: 'abc?def=123&hij=456', extension: 'md' },
    ];

    useCases.forEach(({ url, extension }) => {
      const expectedResponse = extension !== 'md'
        ? '```' + extension + '\n' + mockResponse + '\n```'
        : mockResponse;

      expect(wrapByExtension(url, mockResponse)).toEqual(expectedResponse);
    });
  });
});
