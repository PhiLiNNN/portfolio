import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  iconArr = [
    { src: 'angular', name: 'Angular' },
    { src: 'typescript', name: 'TypeScript' },
    { src: 'javascript', name: 'JavaScript' },
    { src: 'python', name: 'Python' },
    { src: 'html', name: 'HTML' },
    { src: 'css', name: 'CSS' },
    { src: 'firebase', name: 'Firebase' },
    { src: 'git', name: 'Git' },
    { src: 'scrum', name: 'Scrum' },
    { src: 'api', name: 'Rest Api' },
    { src: 'material', name: 'Material Design' },
    { src: 'plsql', name: 'PL/SQL' },
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
