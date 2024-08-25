import { Component, HostListener, Input, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-arrow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './arrow.component.html',
  styleUrl: './arrow.component.scss',
})
export class ArrowComponent {
  /**
   * Flag to ensure the animation only plays once.
   * @private
   * @type {boolean}
   */
  private animationPlayed: boolean = false;

  /**
   * Determines the alignment of the arrow component ('left' or 'right').
   * @type {'left' | 'right'}
   */
  @Input() alignment: 'left' | 'right' = 'left';

  /**
   * A unique identifier for the section associated with the arrow.
   * It is used for triggering SVG animations.
   * @type {string}
   */
  @Input() sectionId: string = this.generateUniqueId();

  /**
   * Controls the maximum offset for the arrow animation (if applicable).
   * @type {number}
   */
  @Input() maxOffset: number = 4;

  /**
   * Constructor that injects the ElementRef to access the component's native element.
   *
   * @param {ElementRef} el - Reference to the component's DOM element.
   */
  constructor(private el: ElementRef) {}

  /**
   * Listens to the window scroll event to check if the arrow is in the viewport.
   * If the arrow is visible and the animation hasn't played yet, it triggers the animation.
   *
   * @param {Event} event - The scroll event.
   */
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    const element = this.el.nativeElement.querySelector('.index-arrow');
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const isElementInViewport =
      rect.top >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight);

    if (isElementInViewport && !this.animationPlayed) {
      this.triggerAnimation('forward');
      this.animationPlayed = true;
    }
  }

  /**
   * Triggers the SVG animation for the arrow based on the provided direction.
   *
   * @param {'forward'} direction - The direction in which the animation should play.
   */
  triggerAnimation(direction: 'forward'): void {
    const animationId = this.sectionId;
    const animElement = document.getElementById(
      animationId
    ) as SVGAnimateElement | null;

    if (animElement) animElement.beginElement();
  }

  /**
   * Generates a unique ID for the section, used for linking the arrow animation.
   * This method ensures the ID is unique to avoid conflicts in the DOM.
   *
   * @private
   * @returns {string} - A unique identifier string.
   */
  private generateUniqueId(): string {
    return `section_${Math.random().toString(36).substr(2, 9)}`;
  }
}
