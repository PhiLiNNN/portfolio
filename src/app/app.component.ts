import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { AotComponent } from './aot/aot.component';
import { AboutMeComponent } from './aboutMe/aboutMe.component';
import { SkillsComponent } from './skills/skills.component';
import { ReferencesComponent } from './references/references.component';
import { FooterComponent } from './shared/footer/footer.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
export class AppComponent {
  constructor(public translate: TranslateService) {
    this.translate.setDefaultLang('ru');
  }
}
