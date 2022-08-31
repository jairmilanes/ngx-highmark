import {SecurityContext} from "@angular/core";
import {ɵDomSanitizerImpl as DomSanitizerImpl} from "@angular/platform-browser";
import {marked} from "marked";
import { sanitizer } from './sanitize';

describe('Utils: Sanitize', () => {
  it('should not sanitize parsed markdown', () => {
    const mockRaw = '### Markdown-x';
    const domSanitizer = new DomSanitizerImpl(document);
    const sanitize = sanitizer(domSanitizer);
    const expected = marked.parse(mockRaw);
    const parseOptions = { decodeHtml: false, securityContext: SecurityContext.HTML, markedOptions: {} };

    expect(sanitize(expected, parseOptions)).toBe(domSanitizer.sanitize(SecurityContext.HTML, expected));
  });

  it('should sanitize parsed markdown', () => {
    const mockRaw = '### Markdown-x';
    const domSanitizer = new DomSanitizerImpl(document);
    const sanitize = sanitizer(domSanitizer);
    const expected = marked.parse(mockRaw);
    const parseOptions = { decodeHtml: true, securityContext: SecurityContext.HTML, markedOptions: {} };

    expect(sanitize(expected, parseOptions)).toBe(domSanitizer.sanitize(SecurityContext.HTML, expected)!);
    expect(sanitize(expected, parseOptions)).not.toBe(expected);
  });
});
