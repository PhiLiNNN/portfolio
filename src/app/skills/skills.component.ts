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
  /**
   * An array of objects representing different skills, each with an icon source and a name.
   * @type {Array<{ src: string; name: string }>}
   */
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

  /**
   * A boolean flag indicating whether the icons should be shown or not.
   * @type {boolean}
   */
  showIcons = false;

  /**
   * Creates an instance of SkillsComponent.
   *
   * @param {ElementRef} el - The ElementRef to access the DOM element.
   */
  constructor(private el: ElementRef) {}

  /**
   * Event handler for the scroll event. Sets the `showIcons` property to true if the section is in the viewport.
   *
   * @param {Event} event - The scroll event.
   */
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const sectionElement = this.el.nativeElement.querySelector('section');
    if (this.isElementInViewport(sectionElement)) this.showIcons = true;
  }

  /**
   * Checks if the given element is within the viewport.
   *
   * @param {HTMLElement} el - The element to check.
   * @returns {boolean} - True if the element is within the viewport, otherwise false.
   */
  private isElementInViewport(el: HTMLElement): boolean {
    return el.getBoundingClientRect().top <= 200;
  }
}
