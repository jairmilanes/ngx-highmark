import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { first } from 'rxjs/operators';

import { MarkdownComponent } from './markdown.component';
import { MarkdownModule } from './markdown.module';
import { MarkdownService } from './markdown.service';

describe('MarkdownComponent', () => {
  let fixture: ComponentFixture<MarkdownComponent>;
  let component: MarkdownComponent;
  let markdownService: MarkdownService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MarkdownModule.forRoot(),
      ],
    }).compileComponents();

    markdownService = TestBed.inject(MarkdownService);
    fixture = TestBed.createComponent(MarkdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('data', () => {

    it('should call render with provided data when set', () => {

      const spyRender = spyOn(component, 'render');

      const useCases = [
        '',
        '# Markdown',
        '<p>Html</p>',
      ];

      useCases.forEach(data => {
        component.data = data;
        component.ngOnChanges();
        expect(component.render).toHaveBeenCalledWith(data);
        spyRender.calls.reset();
      });
    });

    it('should return value correctly when get', () => {

      const mockData = '# Markdown';

      component.data = mockData;

      expect(component.data).toBe(mockData);
    });
  });

  describe('src', () => {

    it('should call render with retreived content when set', () => {

      const mockSrc = './src-example/file.md';
      const mockContent = 'source-content';

      spyOn(component, 'render');
      spyOn(markdownService, 'getSource').and.returnValue(of(mockContent));

      component.src = mockSrc;

      component.ngOnChanges();

      expect(markdownService.getSource).toHaveBeenCalledWith(mockSrc);
      expect(component.render).toHaveBeenCalledWith(mockContent);
    });

    it('should return value correctly when get', () => {

      const mockSrc = './src-example/file.md';

      spyOn(markdownService, 'getSource').and.returnValue(of());

      component.src = mockSrc;

      expect(component.src).toBe(mockSrc);
    });

    it('should emit error when and error occurs', () => {
      const mockSrc = './src-example/file.md';
      const mockError = new Error('error-x');

      spyOn(markdownService, 'getSource').and.returnValue(throwError(mockError));
      spyOn(component.error, 'emit');

      component.src = mockSrc;

      component.ngOnChanges();

      expect(component.error.emit).toHaveBeenCalledWith(mockError);
    });
  });

  describe('ngAfterViewInit', () => {

    it('should call render method and decodeHtml when neither data or src input property is provided', () => {

      const mockHtmlElement = document.createElement('div');
      mockHtmlElement.innerHTML = 'inner-html';

      spyOn(markdownService, 'getSource').and.returnValue(of());

      component.element = new ElementRef(mockHtmlElement);
      component.data = undefined;
      component.src = undefined;

      spyOn(component, 'render');

      component.ngAfterViewInit();

      expect(component.render).toHaveBeenCalledWith(mockHtmlElement.innerHTML, true);
    });

    it('should not call render method when src is provided', () => {

      const mockHtmlElement = document.createElement('div');
      mockHtmlElement.innerHTML = 'inner-html';

      spyOn(markdownService, 'getSource').and.returnValue(of());

      component.element = new ElementRef(mockHtmlElement);
      component.src = './src-example/file.md';

      spyOn(component, 'render');

      component.ngAfterViewInit();

      expect(component.render).not.toHaveBeenCalled();
    });

    it('should not call render method when data is provided', () => {

      const mockHtmlElement = document.createElement('div');
      mockHtmlElement.innerHTML = 'inner-html';

      component.element = new ElementRef(mockHtmlElement);
      component.data = '# Markdown';

      spyOn(component, 'render');

      component.ngAfterViewInit();

      expect(component.render).not.toHaveBeenCalled();
    });

    it('should rerender content on demand', () => {

      spyOn(component, 'renderContent');

      markdownService.reload();

      expect(component.renderContent).toHaveBeenCalled();
    });
  });

  describe('render', () => {

    it('should parse markdown through MarkdownService', () => {
      const raw = '### Raw';

      spyOn(markdownService, 'parse');

      component.inline = true;
      component.emoji = false;
      component.render(raw, true);

      expect(markdownService.parse).toHaveBeenCalledWith(raw, {
        decodeHtml: true,
        inline: true,
        emoji: false,
      });
    });

    it('should set innerHTML with parsed markdown', () => {
      const raw = '### Raw';
      const parsed = '<h3>Compiled</h3>';

      spyOn(markdownService, 'parse').and.returnValue(parsed);

      component.render(raw, true);

      expect(component.element.nativeElement.innerHTML).toBe(parsed);
    });

    it('should render html element through MarkdownService', () => {
      const raw = '### Raw';
      const parsed = '<h3>Compiled</h3>';

      spyOn(markdownService, 'parse').and.returnValue(parsed);
      spyOn(markdownService, 'highlight');

      component.render(raw);

      expect(markdownService.parse).toHaveBeenCalledWith(raw, {
        decodeHtml: false,
        inline: false,
        emoji: false,
      });

      expect(markdownService.highlight).toHaveBeenCalledWith(
        component.element.nativeElement,
      );
    });

    it('should emit `ready` when parsing and rendering is done', () => {

      const markdown = '# Markdown';
      const parsed = '<h1 id="markdown">Markdown</h1>';

      spyOn(markdownService, 'parse').and.returnValue(parsed);
      spyOn(markdownService, 'highlight');

      component.ready
        .pipe(first())
        .subscribe(() => {
          expect(markdownService.parse).toHaveBeenCalled();
          expect(component.element.nativeElement.innerHTML).toBe(parsed);
          expect(markdownService.highlight).toHaveBeenCalled();
        });

      component.render(markdown);
    });
  });
});
