import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './../shared/header/header.component';
import { AotComponent } from './../aot/aot.component';
import { AboutMeComponent } from './../aboutMe/aboutMe.component';
import { SkillsComponent } from './../skills/skills.component';
import { ReferencesComponent } from './../references/references.component';
import { ArrowComponent } from '../shared/arrow/arrow.component';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    HeaderComponent,
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
  constructor() {}

  /**
   * Scrolls the page smoothly to the specified section.
   * The section is identified by its HTML element ID.
   *
   * @param {string} section - The ID of the section to scroll to.
   */
  scrollTo(section: string) {
    const element = document.getElementById(section);
    if (element) element.scrollIntoView();
  }
}
