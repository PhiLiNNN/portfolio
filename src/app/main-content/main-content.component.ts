import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './../shared/header/header.component';
import { AotComponent } from './../aot/aot.component';
import { AboutMeComponent } from './../aboutMe/aboutMe.component';
import { SkillsComponent } from './../skills/skills.component';
import { ReferencesComponent } from './../references/references.component';
import { ContactComponent } from '../contact/contact.component';
import { ActivatedRoute } from '@angular/router';
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
    ContactComponent,
    ArrowComponent,
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        this.scrollToFragment(fragment);
      }
    });
  }

  private scrollToFragment(fragment: string): void {
    setTimeout(() => {
      const element = document.getElementById(fragment);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }
    }, 100);
  }
}
