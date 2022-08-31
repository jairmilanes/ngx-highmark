import {LayoutModule} from '@angular/cdk/layout';
import {CdkMenuModule} from '@angular/cdk/menu';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, SecurityContext } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatSidenavModule} from "@angular/material/sidenav";
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HighlightOptions, MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-highmark';
import { AnchorModule } from '@shared/anchor/anchor.module';
import { AnchorService } from '@shared/anchor/anchor.service';
import { SharedModule } from '@shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { languageMap } from './highlight-languages';

export function markedOptionsFactory(anchorService: AnchorService): MarkedOptions {
  const renderer = new MarkedRenderer();

  // fix `href` for absolute link with fragments so that _copy-paste_ urls are correct
  renderer.link = (href: string, title: string, text: string) => {
    return MarkedRenderer.prototype.link.call(renderer, anchorService.normalizeExternalUrl(href), title, text) as string;
  };

  return { renderer };
}

@NgModule({
  imports: [
    AnchorModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LayoutModule,
    CdkMenuModule,
    MarkdownModule.forRoot({
      loader: HttpClient,
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markedOptionsFactory,
        deps: [AnchorService],
      },
      highlightOptions: {
        provide: HighlightOptions,
        useValue: {
          languageMap: languageMap,
        },
      },
      sanitize: SecurityContext.NONE,
    }),
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatToolbarModule,
    MatSidenavModule,
    SharedModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }
