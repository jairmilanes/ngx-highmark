import {SecurityContext} from "@angular/core";
import {ParseOptions} from "../types";
import {errorJoyPixelsNotLoaded, parseEmojis} from './parse-emojis';

describe('Utils: Parse Emojis', () => {
  const parseOptions: ParseOptions = {
    decodeHtml: true,
    markedOptions: {},
    securityContext: SecurityContext.NONE,
  };

  it('should throw when emoji is true but emoji-toolkit is not loaded', () => {
    window.joypixels = undefined;

    expect(() => parseEmojis('I :heart: ngx-highmark', { ...parseOptions, decodeHtml: false, emoji: true })).toThrowError(errorJoyPixelsNotLoaded);

    window.joypixels = { shortnameToUnicode: undefined };

    expect(() => parseEmojis('I :heart: ngx-highmark', { ...parseOptions, decodeHtml: false, emoji: true })).toThrowError(errorJoyPixelsNotLoaded);
  });

  it('should call joypixels when emoji is true', () => {
    const mockRaw = 'I :heart: ngx-highmark';
    const mockEmojified = 'I ❤️ ngx-highmark';

    window['joypixels'] = { shortnameToUnicode: () => '' };

    spyOn(window.joypixels, 'shortnameToUnicode').and.returnValue(mockEmojified);

    expect(parseEmojis(mockRaw, { ...parseOptions, decodeHtml: false, emoji: true })).toEqual(mockEmojified);
    expect(window.joypixels.shortnameToUnicode).toHaveBeenCalledWith(mockRaw);
  });

  it('should not call joypixels when emoji is omitted/false/null/undefined', () => {
    const mockRaw = '### Markdown-x';

    window.joypixels = { shortnameToUnicode: () => '' };

    spyOn(window.joypixels, 'shortnameToUnicode');

    const useCases = [
      () => parseEmojis(mockRaw, { ...parseOptions, decodeHtml: false }),
      () => parseEmojis(mockRaw, { ...parseOptions, decodeHtml: false, emoji: false }),
      () => parseEmojis(mockRaw, { ...parseOptions, decodeHtml: false, emoji: null! }),
      () => parseEmojis(mockRaw, { ...parseOptions, decodeHtml: false, emoji: undefined }),
    ];

    useCases.forEach(func => {
      func();
      expect(window["joypixels"].shortnameToUnicode).not.toHaveBeenCalled();
    });
  });
});
