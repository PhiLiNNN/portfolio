import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { AotComponent } from './aot/aot.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { SkillsComponent } from './skills/skills.component';
import { RefrencesComponent } from './refrences/refrences.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    AotComponent,
    AboutMeComponent,
    SkillsComponent,
    RefrencesComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'portfolio';
}
