import {SecurityContext} from "@angular/core";
import {ParseOptions} from "../types";
import {htmlDecode} from './decode-html';

describe('Utils: Decode HTML', () => {
  const parseOptions: ParseOptions = {
    decodeHtml: true,
    markedOptions: {},
    securityContext: SecurityContext.NONE,
  };

  it('should decode HTML correctly when decodeHtml is true ', () => {
    const mockRaw = '&lt;html&gt;';
    const expected = '<html>';

    expect(htmlDecode(mockRaw, {...parseOptions, decodeHtml: true })).toBe(expected);
  });

  it('should not decode HTML when decodeHtml is omitted/false/null/undefined', () => {
    const mockRaw = '&lt;html&gt;';
    const expected = '<p>&lt;html&gt;</p>\n';

    expect(htmlDecode(mockRaw, {...parseOptions, decodeHtml: false })).not.toBe(expected);
    expect(htmlDecode(mockRaw, {...parseOptions, decodeHtml: null! })).not.toBe(expected);
    expect(htmlDecode(mockRaw, {...parseOptions, decodeHtml: undefined! })).not.toBe(expected);
  });
});
