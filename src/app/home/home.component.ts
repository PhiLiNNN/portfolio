import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../shared/seo.service';
import { AboutComponent } from '../sections/about/about.component';
import { ContactComponent } from '../sections/contact/contact.component';
import { ExperienceComponent } from '../sections/experience/experience.component';
import { HeroComponent } from '../sections/hero/hero.component';
import { OffCodeComponent } from '../sections/off-code/off-code.component';
import { ProjectsComponent } from '../sections/projects/projects.component';
import { ServicesComponent } from '../sections/services/services.component';
import { SkillsComponent } from '../sections/skills/skills.component';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    AboutComponent,
    OffCodeComponent,
    SkillsComponent,
    ServicesComponent,
    ExperienceComponent,
    ProjectsComponent,
    ContactComponent,
  ],
  template: `
    <app-hero />
    <app-about />
    <app-off-code />
    <app-skills />
    <app-services />
    <app-experience />
    <app-projects />
    <app-contact />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor() {
    inject(SeoService).set({ titleKey: 'seo.home.title', descriptionKey: 'seo.home.description', path: '/' });
  }
}
