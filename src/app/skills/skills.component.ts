import { Component, ElementRef, HostListener } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
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
  ];
  showIcons = false;
  constructor(private el: ElementRef) {}

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const sectionElement = this.el.nativeElement.querySelector('section');
    if (this.isElementInViewport(sectionElement)) this.showIcons = true;
  }
  private isElementInViewport(el: HTMLElement): boolean {
    return el.getBoundingClientRect().top <= 200;
  }
}
