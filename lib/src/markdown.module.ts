import { CommonModule } from '@angular/common';
import {ModuleWithProviders, NgModule, SecurityContext} from '@angular/core';
import hljs from "highlight.js/lib/core";
import { LanguagePipe } from './language.pipe';
import { MarkdownComponent } from './markdown.component';
import { MarkdownPipe } from './markdown.pipe';
import { MarkdownService, SECURITY_CONTEXT } from './markdown.service';
import {HighlightOptions, MarkdownModuleConfig} from "./types";

const sharedDeclarations = [
  LanguagePipe,
  MarkdownComponent,
  MarkdownPipe,
];

@NgModule({
  imports: [CommonModule],
  exports: sharedDeclarations,
  declarations: sharedDeclarations,
})
export class MarkdownModule {
  static forRoot(markdownModuleConfig?: MarkdownModuleConfig): ModuleWithProviders<MarkdownModule> {

    const highlightOptions = markdownModuleConfig?.highlightOptions;

    if (highlightOptions) {
      const { languageMap } = highlightOptions.useValue as HighlightOptions;

      if (languageMap) {
        Object.keys(languageMap).forEach((languageName: string) => {
          hljs.registerLanguage(languageName, languageMap[languageName]);
        });

        delete markdownModuleConfig?.highlightOptions;
      }
    }

    return {
      ngModule: MarkdownModule,
      providers: [
        MarkdownService,
        markdownModuleConfig && markdownModuleConfig.loader || [],
        markdownModuleConfig && markdownModuleConfig.markedOptions || [],
        markdownModuleConfig && markdownModuleConfig.highlightOptions || [],
        {
          provide: SECURITY_CONTEXT,
          useValue: markdownModuleConfig && markdownModuleConfig.sanitize != null
            ? markdownModuleConfig.sanitize
            : SecurityContext.HTML,
        },
      ],
    };
  }

  static forChild(): ModuleWithProviders<MarkdownModule> {
    return {
      ngModule: MarkdownModule,
    };
  }
}
