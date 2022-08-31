import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SecurityContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import hljs from "highlight.js/lib/core";
import { marked } from 'marked';
import { first } from 'rxjs/operators';
import { MarkdownModule } from './markdown.module';
import {MarkdownService, SECURITY_CONTEXT} from './markdown.service';

describe('MarkdowService', () => {
  let domSanitizer: DomSanitizer;
  let http: HttpTestingController;
  let markdownService: MarkdownService;


  describe('with SecurityContext.HTML', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          MarkdownModule.forRoot({ sanitize: SecurityContext.HTML }),
        ],
      });

      domSanitizer = TestBed.inject(DomSanitizer);
      markdownService = TestBed.inject(MarkdownService);
    });

    it('should sanitize parsed markdown', () => {
      const securityContext = TestBed.inject(SECURITY_CONTEXT);

      const mockRaw = '### Markdown-x';
      const sanitized = domSanitizer.sanitize(securityContext, marked.parse(mockRaw));
      const unsanitized = marked.parse(mockRaw);

      expect(markdownService.parse(mockRaw, { decodeHtml: false })).toBe(sanitized);
      expect(markdownService.parse(mockRaw, { decodeHtml: false })).not.toBe(unsanitized);
    });
  });

  describe('with SecurityContext.NONE', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          BrowserModule,
          HttpClientTestingModule,
          MarkdownModule.forRoot({ sanitize: SecurityContext.NONE }),
        ],
      });

      http = TestBed.inject(HttpTestingController);
      markdownService = TestBed.inject(MarkdownService);
    });

    describe('options', () => {
      it('should be initialized correctly', () => {
        expect(markdownService.getOptions({})).toBeDefined();
        expect(markdownService.getOptions({}).markedOptions).toBeDefined();
        expect(markdownService.getOptions({}).markedOptions?.renderer).toBeDefined();
      });

      it('should update correctly', () => {
        const mockBaseUrl = 'mock-url';
        const options = markdownService.getOptions({ markedOptions: { baseUrl: mockBaseUrl }});

        expect(options.markedOptions?.baseUrl).toBe(mockBaseUrl);
        expect(options.markedOptions?.renderer).toBeDefined();
      });
    });

    describe('renderer', () => {
      it('should be initialized correctly', () => {
        expect(markdownService.getOptions({}).markedOptions?.renderer).toBeDefined();
      });

      it('should update option.renderer when updated', () => {
        const blockquote = (quote: string) => `<mock-blockquote>${quote}</mock-blockquote>`;

        markdownService.renderer.blockquote = blockquote;

        const quoteText = 'foobar';
        const expectedBlockquote = blockquote(quoteText);
        const rendererBlockquote = markdownService.renderer.blockquote(quoteText);
        const optionsRendererBlockquote = markdownService.getOptions({}).markedOptions.renderer?.blockquote(quoteText);

        expect(rendererBlockquote).toBe(expectedBlockquote);
        expect(optionsRendererBlockquote).toBe(expectedBlockquote);
      });
    });

    describe('parse', () => {
      it('should not parse markdown when platform is not browser', () => {
        const mockRaw = '### Markdown-x';

        markdownService['platform'] = 'server';

        expect(() => markdownService.parse(mockRaw, {})).not.toThrowError();
        expect(mockRaw).toEqual(mockRaw);
      });

      it('should return inline parsed markdown when inline is true', () => {
        const mockRaw = '### Markdown-x';

        expect(markdownService.parse(mockRaw, { inline: true })).toBe(marked.parseInline(mockRaw));
      });

      it('should return parsed markdown when inline is omitted/false/null/undefined', () => {
        const mockRaw = '### Markdown-x';

        const useCases = [
          () => markdownService.parse(mockRaw, {}),
          () => markdownService.parse(mockRaw, { inline: false }),
          () => markdownService.parse(mockRaw, { inline: null! }),
          () => markdownService.parse(mockRaw, { inline: undefined }),
        ];

        useCases.forEach(func => {
          expect(func()).toBe(marked.parse(mockRaw));
        });
      });

      it('should return empty string when raw is null/undefined/empty', () => {
        expect(markdownService.parse(null!, {})).toBe('');
        expect(markdownService.parse(undefined!, {})).toBe('');
        expect(markdownService.parse('', {})).toBe('');
      });
    });

    describe('reload', () => {
      it('should request reload through reload$ subject', (done) => {
        markdownService.reload$
          .pipe(first())
          .subscribe(() => {
            expect(true).toBeTruthy();
            done();
          });

        markdownService.reload();
      });
    });

    describe('getSource', () => {
      it('should call http service to get src content', () => {
        const mockSrc = 'file-x.md';
        const mockResponse = 'response-x';

        markdownService
          .getSource(mockSrc)
          .subscribe(data => {
            expect(data).toEqual(mockResponse);
          });

        http.expectOne(mockSrc).flush(mockResponse);
      });
    });

    describe('highlight', () => {

      it('should not call Highlight.js or throw when platform is not browser', () => {
        const hljsSpy = spyOn(hljs, 'highlightElement');
        const mockHtmlElement = document.createElement('div');

        markdownService['platform'] = 'server';

        expect(() => markdownService.highlight(mockHtmlElement)).not.toThrow();
        expect(hljsSpy).not.toHaveBeenCalled();
      });

      it('should add `language-none` class on code blocks with no language class', () => {
        const preElement = document.createElement('pre');
        const codeElement = document.createElement('code');

        preElement.appendChild(codeElement);

        markdownService.highlight(preElement);

        expect(codeElement.classList).toContain('language-none');
      });

      it('should not add `language-none` class on code blocks with language class', () => {
        const preElement = document.createElement('pre');
        const codeElement = document.createElement('code');

        codeElement.classList.add('language-mock');
        preElement.appendChild(codeElement);
        markdownService.highlight(preElement);

        expect(codeElement.classList).not.toContain('language-none');
        expect(codeElement.classList).toContain('language-mock');
      });

      it('should not add `language-none` class on element other than code blocks without language class', () => {
        const divElement = document.createElement('div');
        const codeElement = document.createElement('code');

        codeElement.classList.add('language-mock');
        divElement.appendChild(codeElement);
        markdownService.highlight(divElement);

        expect(codeElement.classList).not.toContain('language-none');
        expect(codeElement.classList).toContain('language-mock');
      });

      it('should call Highlight.js', () => {
        const hljsSpy = spyOn(hljs, 'highlightElement');
        const preElement = document.createElement('pre');
        const codeElement = document.createElement('code');

        codeElement.classList.add('language-mock');
        preElement.appendChild(codeElement);
        markdownService.highlight(preElement);

        expect(hljsSpy).toHaveBeenCalledWith(codeElement);
      });

      it('should call Highlight.js when available and element parameter is ommited/null/undefined', () => {
        const hljsSpy = spyOn(hljs, 'highlightElement');

        const preElement = document.createElement('pre');
        const codeElement = document.createElement('code');

        codeElement.classList.add('language-mock');
        preElement.appendChild(codeElement);

        document.body.appendChild(preElement);

        const useCases = [
          () => markdownService.highlight(),
          () => markdownService.highlight(null!),
          () => markdownService.highlight(undefined),
        ];

        useCases.forEach(func => {
          func();
          expect(hljsSpy).toHaveBeenCalledWith(codeElement);
          hljsSpy.calls.reset();
        });
      });
    });
  });
});
