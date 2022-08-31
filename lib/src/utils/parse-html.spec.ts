import {SecurityContext} from "@angular/core";
import {marked} from "marked";
import {ParseOptions} from "../types";
import { parseMarked } from './parse-html';

describe('Utils: Parse HTML', () => {
  const parseOptions: ParseOptions = {
    decodeHtml: true,
    markedOptions: {},
    securityContext: SecurityContext.NONE,
  };

  it('should parse markdown', () => {
    const mockedRaw = `
      ### Markdown
      with some content
    `;
    const parsed = parseMarked(mockedRaw, parseOptions);

    expect(parsed).toBe(marked.parse(mockedRaw));
    expect(parsed).not.toBe(marked.parseInline(mockedRaw));
  });



  it('should parse markdown inline', () => {
    const mockedRaw = `
      ### Markdown
      with some content
    `;

    const parsedInline = parseMarked(mockedRaw, {...parseOptions, inline: true});

    expect(parsedInline).toBe(marked.parseInline(mockedRaw));
    expect(parsedInline).not.toBe(marked.parse(mockedRaw));
  });
});
