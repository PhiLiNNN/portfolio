import { Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.scss',
})
export class AboutMeComponent {
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  onMouseEnter() {
    const toSkillsArrow =
      this.el.nativeElement.querySelector('.to-skills-arrow');
    this.renderer.addClass(toSkillsArrow, 'hovered');
  }
}
