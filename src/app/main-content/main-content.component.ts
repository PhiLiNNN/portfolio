import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { AotComponent } from './../aot/aot.component';
import { AboutMeComponent } from './../aboutMe/aboutMe.component';
import { SkillsComponent } from './../skills/skills.component';
import { ReferencesComponent } from './../references/references.component';
import { ArrowComponent } from '../shared/arrow/arrow.component';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    AotComponent,
    AboutMeComponent,
    SkillsComponent,
    ReferencesComponent,
    ArrowComponent,
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  scrollTo(section: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }
}
