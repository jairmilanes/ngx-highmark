import { ChangeDetectionStrategy, Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-plugins',
  templateUrl: './plugins.component.html',
  styleUrls: ['./plugins.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PluginsComponent implements OnInit {
  emojiMarkdown = `# I :heart: ngx-highmark`;

  headings: Element[] | undefined;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) { }

  ngOnInit(): void {
    this.setHeadings();
  }

  private setHeadings(): void {
    const headings: Element[] = [];
    this.elementRef.nativeElement
      .querySelectorAll('h2')
      .forEach(x => headings.push(x));
    this.headings = headings;
  }
}
