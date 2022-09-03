<p align="center">
  <img alt="Ngx-Highmark Logo" src="https://github.com/jairmilanes/ngx-highmark/raw/master/demo/src/assets/ngx-highmark-logo.png" />
</p>
<p align="center">
  <a href="https://coveralls.io/github/jairmilanes/ngx-highmark?branch=master">
    <img alt="Coverage Status" src="https://coveralls.io/repos/github/jairmilanes/ngx-highmark/badge.svg?branch=master" />
  </a>
  <a href="https://www.npmjs.com/package/ngx-highmark">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/ngx-highmark.svg?style=flat" />
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img alt="License" src="https://img.shields.io/npm/l/ngx-highmark.svg" />
  </a>
  <br />
  <img alt="Dependency Status" src="https://img.shields.io/librariesio/release/npm/ngx-highmark/14.0.1" />
  <a href="https://www.npmjs.com/package/ngx-highmark">
    <img alt="Monthly Downloads" src="https://img.shields.io/npm/dm/ngx-highmark.svg" />
  </a>
</p>

# ngx-highmark

Ngx-Highmark is an [Angular](https://angular.io/) library initially forked from the great [ngx-markdown](https://github.com/jfcere/ngx-markdown) module, I wanted to use Highlight.js instead of **Prism.js** and so I've created this variation. I've also stripped _Katex_, _Mermaid_ and _Clipboard_ support to make this as small and stray to the point as possible, since all most look for is **Markdown** and code syntax highlighting only.

ngx-highmark combines:

- [Marked](http://marked.js.org/) to parse markdown to HTML
- [Highlight.js](https://highlightjs.org/) for language syntax highlight
- [Emoji-Toolkit](https://github.com/joypixels/emoji-toolkit) for emoji support

A Demo can be found @ [https://jairmilanes.github.io/ngx-highmark](https://jairmilanes.github.io/ngx-highmark)

### Table of contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Renderer](#renderer)
- [Syntax highlight](#syntax-highlight)
- [Demo application](#demo-application)
- [AoT compilation](#aot-compilation)
- [Contribution](#contribution)
- [Support Development](#support-development)

## Installation

To add ngx-highmark library to your `package.json` use the following command.

```bash
npm install ngx-highmark --save
```

## Configuration

### NgxHighmark module

You must import `MarkdownModule` inside your main application module (usually named AppModule) with `forRoot` to be able to use `markdown` component and/or directive.

```diff
import { NgModule } from '@angular/core';
+ import { MarkdownModule } from 'ngx-highmark';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
+   MarkdownModule.forRoot(),
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }
```

### Load Marked lib

As the library is using [Marked](https://github.com/chjj/marked) parser you will need to add `node_modules/marked/marked.min.js` to your application.

If you are using [Angular CLI](https://cli.angular.io/) you can follow the `angular.json` example below...

```diff
"scripts": [
+ "node_modules/marked/marked.min.js"
]
```

### Config Syntax highlighting

> :bell: Syntax highlight is available out of the box, all you must do is configure your theme of choice and the set of languages you will need.

Load your desired theme by adding it to your `angular.json` like below:

```diff
"styles": [
  "styles.css",
+ "node_modules/highlight.js/scss/default.scss"
],
```

You can view all themes avainlable in the [Highlight.js website](https://highlightjs.org/static/demo/)

Next load your desired code language syntax files - from `node_modules/highlight.js/lib/languages` directory, if you loading more than a few we recommend creating a separate file with a map like so:

```typescript
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import less from "highlight.js/lib/languages/less";
import markdown from "highlight.js/lib/languages/markdown";
import plaintext from "highlight.js/lib/languages/plaintext";
import { LanguageMap } from "ngx-highmark";

export const languageMap: LanguageMap = {
  javascript,
  json,
  less,
  markdown,
  plaintext,
};
```

Next pass it to the NgxHighmark module configuration as below:

```diff
@NgModule({
  imports: [
    ...
+    MarkdownModule.forRoot({
+      highlightOptions: {
+        provide: HighlightOptions,
+        useValue: {
+          languageMap: languageMap,
+        },
+      }
+    }),
    ...
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }
```

you can customize other options for Highlight.js, check their documentation for other available options [here](https://highlightjs.readthedocs.io/en/latest/api.html#configure).

## Optional Configuration

### Emoji support

> :bell: Emoji support is **optional**, skip this step if you are not planning to use it

To activate [Emoji-Toolkit](https://github.com/joypixels/emoji-toolkit) for emoji suppport you will need to include...

- Emoji-Toolkit library - `node_modules/emoji-toolkit/lib/js/joypixels.min.js`

If you are using [Angular CLI](https://cli.angular.io/) you can follow the `angular.json` example below...

```diff
"scripts": [
  "node_modules/marked/marked.min.js",
+ "node_modules/emoji-toolkit/lib/js/joypixels.min.js",
]
```

#### Emoji plugin

Using `markdown` component and/or directive, you will be able to use the `emoji` property to activate [Emoji-Toolkit](https://github.com/joypixels/emoji-toolkit) plugin that converts emoji shortnames such as `:heart:` to native unicode emojis.

```html
<markdown emoji> I :heart: ngx-highmark </markdown>
```

> :blue*book: You can refer to this [Emoji Cheat Sheet](https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md) for a complete list of \_shortnames*.

## Load from URL's

If you want to use the `[src]` attribute to directly load a remote file, in order to keep only one instance of `HttpClient` and avoid issues with interceptors, you also have to provide `HttpClient`:

```diff
imports: [
+  HttpClientModule,
+  MarkdownModule.forRoot({ loader: HttpClient }),
],
```

## Sanitization

Sanitization is enabled by default and uses Angular `DomSanitizer` with `SecurityContext.HTML` to avoid XSS vulnerabilities. The `SecurityContext` level can be changed using the `sanitize` property when configuring `MarkdownModule`.

```typescript
import { SecurityContext } from "@angular/core";

// turn off sanitization
MarkdownModule.forRoot({
  sanitize: SecurityContext.NONE,
});
```

> :blue_book: Follow [Angular DomSanitizer](https://angular.io/api/platform-browser/DomSanitizer#sanitize) documentation for more information on sanitization and security contexts.

## MarkedOptions

Optionally, markdown parsing can be configured by passing [MarkedOptions](https://marked.js.org/#/USING_ADVANCED.md#options) to the `forRoot` method of `MarkdownModule`.

Imports:

```typescript
import { MarkdownModule, MarkedOptions } from "ngx-highmark";
```

Default options:

```typescript
// using default options
MarkdownModule.forRoot();
```

Custom options and passing `HttpClient` to use `[src]` attribute:

```typescript
// using specific options with ValueProvider and passing HttpClient
MarkdownModule.forRoot({
  loader: HttpClient, // optional, only if you use [src] attribute
  markedOptions: {
    provide: MarkedOptions,
    useValue: {
      gfm: true,
      breaks: false,
      pedantic: false,
      smartLists: true,
      smartypants: false,
    },
  },
});
```

#### MarkedOptions.renderer

`MarkedOptions` also exposes the `renderer` property which allows you to override token rendering for your whole application.

The example below overrides the default blockquote token rendering by adding a CSS class for custom styling when using Bootstrap CSS:

```typescript
import { MarkedOptions, MarkedRenderer } from "ngx-highmark";

// function that returns `MarkedOptions` with renderer override
export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();

  renderer.blockquote = (text: string) => {
    return '<blockquote class="blockquote"><p>' + text + "</p></blockquote>";
  };

  return {
    renderer: renderer,
    gfm: true,
    breaks: false,
    pedantic: false,
    smartLists: true,
    smartypants: false,
  };
}

// using specific option with FactoryProvider
MarkdownModule.forRoot({
  loader: HttpClient,
  markedOptions: {
    provide: MarkedOptions,
    useFactory: markedOptionsFactory,
  },
});
```

### Other application modules

Use `forChild` when importing `MarkdownModule` into other application modules to allow you to use the same parser configuration across your application.

```diff
import { NgModule } from '@angular/core';
+ import { MarkdownModule } from 'ngx-highmark';

import { HomeComponent } from './home.component';

@NgModule({
  imports: [
+   MarkdownModule.forChild(),
  ],
  declarations: [HomeComponent],
})
export class HomeModule { }
```

## Usage

`ngx-highmark` provides different approaches to help you parse markdown to your application depending on your needs.

> :bulb: As of Angular 6, the template compiler strips whitespace by default. Use `ngPreserveWhitespaces` directive to preserve whitespaces such as newlines in order for the markdown-formatted content to render as intended.  
> https://angular.io/api/core/Component#preserveWhitespaces

### Component

You can use `markdown` component to either parse static markdown directly from your HTML markup, load the content from a remote URL using `src` property or bind a variable to your component using `data` property. You can get a hook on load complete using `load` output event property, on loading error using `error` output event property or when parsing is completed using `ready` output event property.

```html
<!-- static markdown -->
<markdown ngPreserveWhitespaces> # Markdown </markdown>

<!-- loaded from remote url -->
<markdown
  [src]="'path/to/file.md'"
  (load)="onLoad($event)"
  (error)="onError($event)"
>
</markdown>

<!-- variable binding -->
<markdown [data]="markdown" (ready)="onReady()"> </markdown>

<!-- inline parser, omitting rendering top-level paragraph -->
<markdown [data]="markdown" [inline]="true"> </markdown>
```

### Directive

The same way the component works, you can use `markdown` directive to accomplish the same thing.

```html
<!-- static markdown -->
<div markdown ngPreserveWhitespaces># Markdown</div>

<!-- loaded from remote url -->
<div
  markdown
  [src]="'path/to/file.md'"
  (load)="onLoad($event)"
  (error)="onError($event)"
></div>

<!-- variable binding -->
<div markdown [data]="markdown" (ready)="onReady()"></div>

<!-- inline parser, omitting rendering top-level paragraph -->
<div markdown [data]="markdown" [inline]="true"></div>
```

### Pipe

Using `markdown` pipe to transform markdown to HTML allow you to chain pipe transformations and will update the DOM when value changes.

```html
<!-- chain `language` pipe with `markdown` pipe to convert typescriptMarkdown variable content -->
<div
  [innerHTML]="typescriptMarkdown | language : 'typescript' | markdown"
></div>
```

The `markdown` pipe allow you to use all the same plugins as the component by providing the options parameters.

```html
<!-- provide options parameters to activate plugins or for configuration -->
<div
  [innerHTML]="typescriptMarkdown | language : 'typescript' | markdown : { emoji: true, inline: true }"
></div>
```

This is the `MarkdownPipeOptions` parameters interface, those options are the same as the ones available for the `markdown` component:

```typescript
export interface MarkdownPipeOptions {
  decodeHtml?: boolean;
  inline?: boolean;
  emoji?: boolean;
  katex?: boolean;
  katexOptions?: KatexOptions;
  mermaid?: boolean;
  mermaidOptions?: MermaidAPI.Config;
  markedOptions?: MarkedOptions;
}
```

### Service

You can use `MarkdownService` to have access to markdown parsing, rendering and syntax highlight methods.

```typescript
import { Component, OnInit } from '@angular/core';
import { MarkdownService } from 'ngx-highmark';

@Component({ ... })
export class ExampleComponent implements OnInit {
  constructor(private markdownService: MarkdownService) { }

  ngOnInit() {
    // outputs: <p>I am using <strong>markdown</strong>.</p>
    console.log(this.markdownService.parse('I am using __markdown__.'));
  }
}
```

## Renderer

Tokens can be rendered in a custom manner by either...

- providing the `renderer` property with the `MarkedOptions` when importing `MarkdownModule.forRoot()` into your main application module (see [Configuration](#markedoptionsrenderer) section)
- using `MarkdownService` exposed `renderer`

Here is an example of overriding the default heading token rendering through `MarkdownService` by adding an embedded anchor tag like on GitHub:

```typescript
import { Component, OnInit } from "@angular/core";
import { MarkdownService } from "ngx-highmark";

@Component({
  selector: "app-example",
  template: "<markdown># Heading</markdown>",
})
export class ExampleComponent implements OnInit {
  constructor(private markdownService: MarkdownService) {}

  ngOnInit() {
    this.markdownService.renderer.heading = (text: string, level: number) => {
      const escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");
      return (
        "<h" +
        level +
        ">" +
        '<a name="' +
        escapedText +
        '" class="anchor" href="#' +
        escapedText +
        '">' +
        '<span class="header-link"></span>' +
        "</a>" +
        text +
        "</h" +
        level +
        ">"
      );
    };
  }
}
```

This code will output the following HTML:

```html
<h1>
  <a name="heading" class="anchor" href="#heading">
    <span class="header-link"></span>
  </a>
  Heading
</h1>
```

> :blue_book: Follow official [marked.renderer](https://marked.js.org/#/USING_PRO.md#renderer) documentation for the list of tokens that can be overriden.

## Re-render Markdown

In some situations, you might need to re-render markdown after making changes. If you've updated the text this would be done automatically, however if the changes are internal to the library such as rendering options, you will need to inform the `MarkdownService` that it needs to update.

To do so, inject the `MarkdownService` and call the `reload()` function as shown below.

```typescript
import { MarkdownService } from 'ngx-highmark';

constructor(
  private markdownService: MarkdownService
) { }

update() {
  this.markdownService.reload();
}
```

> :blue_book: Refer to the ngx-highmark [re-render demo](https://jairmilanes.github.io/ngx-highmark/rerender) for a live example.

## Syntax highlight

When using static markdown you are responsible to provide the code block with related language.

````diff
<markdown ngPreserveWhitespaces>
+  ```typescript
    const myProp: string = 'value';
+  ```
</markdown>
````

When using remote URL ngx-highmark will use the file extension to automatically resolve the code language.

```html
<!-- will use html highlights -->
<markdown [src]="'path/to/file.html'"></markdown>

<!-- will use php highlights -->
<markdown [src]="'path/to/file.php'"></markdown>
```

When using variable binding you can optionally use `language` pipe to specify the language of the variable content (default value is markdown when pipe is not used).

```html
<markdown [data]="markdown | language : 'typescript'"></markdown>
```

## Demo application

A demo is available @ [https://jairmilanes.github.io/ngx-highmark](https://jairmilanes.github.io/ngx-highmark) and its source code can be found inside the `demo` directory.

The following commands will clone the repository, install npm dependencies and serve the application @ [http://localhost:4200](http://localhost:4200)

```bash
git clone https://github.com/jairmilanes/ngx-highmark.git
npm install
npm start
```

## AoT compilation

Building with AoT is part of the CI and is tested every time a commit occurs so you don't have to worry at all.

## Contribution

Contributions are always welcome, just make sure that ...

- Your code style matches with the rest of the project
- Unit tests pass
- Linter passes

## Support Development

The use of this library is free and no donation is required but don't hesitate to give it a star.

If you enjoyed and made use of this project in a way that it saved you time and helped your sass project, please do consider donating to support it's long term support and development.

## License

Licensed under [MIT](https://opensource.org/licenses/MIT).
