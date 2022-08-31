import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional, PLATFORM_ID, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import hljs from "highlight.js/lib/core";
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { MarkedRenderer } from './marked-renderer';
import {MarkedOptions, ParseOptions, ParseOptionsWithRenderer} from "./types";
import {htmlDecode, parseEmojis, parseMarked, sanitizer, trimLineStart, wrapByExtension} from "./utils";

/* eslint-disable max-len */
export const errorSrcWithoutHttpClient = '[ngx-highmark] When using the `src` attribute you *have to* pass the `HttpClient` as a parameter of the `forRoot` method. See README for more information';
/* eslint-enable max-len */

export const SECURITY_CONTEXT = new InjectionToken<SecurityContext>('SECURITY_CONTEXT');

@Injectable()
export class MarkdownService {

  private _options: ParseOptionsWithRenderer = {
    decodeHtml: true,
    inline: false,
    emoji: false,
    markedOptions: {
      renderer: new MarkedRenderer(),
    },
    highlightOptions: undefined,
    securityContext: this.securityContext,
  };

  get renderer(): MarkedRenderer {
    return this._options.markedOptions.renderer;
  }

  set renderer(renderer: MarkedRenderer) {
    this._options.markedOptions.renderer = renderer;
  }

  private readonly _reload = new Subject<void>();
  readonly reload$ = this._reload.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platform: Object,
    @Inject(SECURITY_CONTEXT) private securityContext: SecurityContext,
    @Optional() private http: HttpClient,
    @Optional() private markedOptions: MarkedOptions,
    private sanitizer: DomSanitizer,
  ) {
    this._options.markedOptions = {
      ...this._options.markedOptions,
      ...this.markedOptions,
    };
  }

  reload(): void {
    this._reload.next();
  }

  getOptions(options: Partial<ParseOptions>): ParseOptions {
    return {
      ...this._options,
      ...(options || {}),
      markedOptions: {
        ...this._options.markedOptions,
        ...(options.markedOptions || {}),
      },
      highlightOptions: {
        ...(this._options.highlightOptions),
        ...(options.highlightOptions || {}),
      },
    } as ParseOptions;
  }

  parse(markdown: string, userOptions: Partial<ParseOptions>): string {
    if (!isPlatformBrowser(this.platform)) {
      return markdown;
    }

    const options = this.getOptions(userOptions);

    return [
      trimLineStart,
      htmlDecode,
      parseEmojis,
      parseMarked,
      sanitizer(this.sanitizer),
    ].reduce((markdown, callback) => (
      callback(markdown, options)
    ), markdown);
  }

  getSource(src: string): Observable<string> {
    if (!this.http) {
      throw new Error(errorSrcWithoutHttpClient);
    }

    return this.http
      .get(src, { responseType: 'text' })
      .pipe(map(markdown => wrapByExtension(src, markdown)));
  }

  highlight(element?: HTMLElement): void {
    if (!isPlatformBrowser(this.platform)) {
      return;
    }

    if (this._options.highlightOptions) {
      hljs.configure(this._options.highlightOptions || {});
    }

    if (!element) {
      element = document.body;
    }

    const noLanguageElements = element.querySelectorAll('pre code:not([class*="language-"])');
    noLanguageElements.forEach((x: Element) => x.classList.add('language-none'));

    const languageElements = element.querySelectorAll('pre code[class*="language-"]');

    languageElements.forEach((x: Element) => {
      hljs.highlightElement(x as HTMLElement);
    });
  }
}
