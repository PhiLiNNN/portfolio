import { Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [],
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
    { src: 'api', name: 'REST API' },
    { src: 'material', name: 'Material Design' },
  ];

  constructor(private el: ElementRef, private renderer: Renderer2) {}
  onMouseEnter() {
    const toSkillsArrow = this.el.nativeElement.querySelector(
      '.to-portfolio-arrow'
    );
    this.renderer.addClass(toSkillsArrow, 'hovered');
  }
}
