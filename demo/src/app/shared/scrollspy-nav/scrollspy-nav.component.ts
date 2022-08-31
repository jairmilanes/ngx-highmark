import { ChangeDetectionStrategy, Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import Gumshoe from 'gumshoejs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-scrollspy-nav',
  templateUrl: './scrollspy-nav.component.html',
  styleUrls: ['./scrollspy-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollspyNavComponent implements OnChanges, OnDestroy {

  @Input()
  headings: Element[] | undefined;

  private scrollSpy: Gumshoe | undefined;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private zone: NgZone,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['headings']?.currentValue) {
      this.setScrollSpy();
    }
  }

  ngOnDestroy(): void {
    if (this.scrollSpy) {
      this.scrollSpy.destroy();
    }
  }

  setScrollSpy(): void {
    if (!this.scrollSpy) {
      this.zone.onStable
        .pipe(first())
        .subscribe(() => {
          const hostElement = this.elementRef.nativeElement;
          const linkSelector = `${hostElement.tagName.toLowerCase()}.${hostElement.className} a`;
          this.scrollSpy = new Gumshoe(linkSelector, { offset: 64, reflow: true });
          this.scrollSpy.setup();
        });
    }
  }
}

