import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-skills',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  skillGroups = [
    {
      titleKey: 'mySkills.frontend',
      icons: [
        { src: 'angular', name: 'Angular' },
        { src: 'typescript', name: 'TypeScript' },
        { src: 'javascript', name: 'JavaScript' },
        { src: 'html', name: 'HTML' },
        { src: 'css', name: 'CSS' },
        { src: 'material', name: 'Material Design' },
      ],
    },
    {
      titleKey: 'mySkills.backend',
      icons: [
        { src: 'python', name: 'Python' },
        { src: 'flask', name: 'Flask' },
        { src: 'django', name: 'Django' },
        { src: 'fastapi', name: 'FastAPI' },
        { src: 'firebase', name: 'Firebase' },
        { src: 'api', name: 'Rest Api' },
        { src: 'plsql', name: 'PL/SQL' },
      ],
    },
    {
      titleKey: 'mySkills.devops',
      icons: [
        { src: 'docker', name: 'Docker' },
        { src: 'cicd', name: 'CI/CD' },
        { src: 'git', name: 'Git' },
        { src: 'scrum', name: 'Scrum' },
      ],
    },
  ];

  showIcons = false;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  @HostListener('window:scroll')
  checkScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.showIcons) return;

    const sectionElement = this.el.nativeElement.querySelector('section');
    if (!sectionElement) return;

    if (this.isElementInViewport(sectionElement)) {
      this.showIcons = true;
    }
  }

  private isElementInViewport(el: HTMLElement): boolean {
    return el.getBoundingClientRect().top <= 200;
  }
}
