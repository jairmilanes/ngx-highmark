import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';
import { MarkdownService } from './markdown.service';
import {ParseOptions} from "./types";
import {coerceToBoolean} from "./utils";

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'markdown, [markdown]',
  template: '<ng-content></ng-content>',
})
export class MarkdownComponent implements OnChanges, AfterViewInit, OnDestroy {

  @Input() data: string | undefined;
  @Input() src: string | undefined;

  // Inline parsing
  @Input() set inline(value: boolean | string) {
    this.parseOptions.inline = coerceToBoolean(value as string);
  }

  // Emojis
  @Input() set emoji(value: boolean | string) {
    this.parseOptions.emoji = coerceToBoolean(value as string);
  }

  // Event emitters
  @Output() error = new EventEmitter<Error>();
  @Output() ready = new EventEmitter<void>();

  private parseOptions: Partial<ParseOptions> = {
    decodeHtml: false,
    inline: false,
    emoji: false,
  };

  private readonly destroyed$ = new Subject<void>();

  constructor(
    public element: ElementRef<HTMLElement>,
    public markdownService: MarkdownService,
  ) {}

  ngOnChanges(): void {
    this.renderContent();
  }

  ngAfterViewInit(): void {
    if (!this.data && !this.src) {
      this.render(this.element.nativeElement.innerHTML, true);
    }

    this.markdownService.reload$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.renderContent());
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  renderContent(): void {
    this.getMarkdown()
      .subscribe({
        next: (markdown: string) => this.render(markdown),
        error: (error: Error) => this.error.emit(error),
      });
  }

  render(markdown: string, decodeHtml = false): void {
    this.element.nativeElement.innerHTML = this.markdownService
      .parse(
        markdown,
        { ...this.parseOptions, decodeHtml },
      );

    this.markdownService.highlight(this.element.nativeElement);

    this.ready.emit();
  }

  private getMarkdown(): Observable<string> {
    return of(this.data)
      .pipe(
        switchMap(data => {
          if (typeof data === 'string') {
            return of(data);
          }

          if (typeof this.src === 'string') {
            return this.markdownService.getSource(this.src);
          }

          throw new Error('Either content or a src url must be provided.');
        }),
      );
  }
}
