import { Component, ElementRef, Renderer2 } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-aboutMe',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './aboutMe.component.html',
  styleUrl: './aboutMe.component.scss',
})
export class AboutMeComponent {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  onMouseEnter() {
    const toSkillsArrow =
      this.el.nativeElement.querySelector('.to-skills-arrow');
    this.renderer.addClass(toSkillsArrow, 'hovered');
  }

  scrollToSkills() {
    const element = document.getElementById('skills-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  scrollToFooter() {
    const element = document.getElementById('footer-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
