import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { AotComponent } from './aot/aot.component';
import { AboutMeComponent } from './aboutMe/aboutMe.component';
import { SkillsComponent } from './skills/skills.component';
import { importProvidersFrom } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';

import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ReferencesComponent } from './references/references.component';
import { FooterComponent } from './shared/footer/footer.component';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './../assets/i18n', 'json');
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    AotComponent,
    AboutMeComponent,
    SkillsComponent,
    ReferencesComponent,
    FooterComponent,
    TranslateModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  languages = ['tr', 'en', 'ru'];

  constructor(public translate: TranslateService) {}
  ngOnInit(): void {
    const defaultLanguage = localStorage.getItem('language') || 'en';
    this.translate.setDefaultLang(defaultLanguage);
    this.translate.use(defaultLanguage);
  }
  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
  ],
});
