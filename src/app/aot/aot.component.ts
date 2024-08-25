import { Component, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-aot',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './aot.component.html',
  styleUrls: ['./aot.component.scss'],
})
export class AotComponent {
  desktopModus = false;
  maskSize: number = 200;
  offsetX: number = 100;
  offsetY: number = 175;

  /**
   * Constructor initializes the component and checks if the screen width is larger than 900px.
   * It injects ElementRef and Renderer2 to manipulate the DOM.
   *
   * @param {ElementRef} el - Reference to the host element.
   * @param {Renderer2} renderer - Angular service for safely interacting with the DOM.
   */
  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.desktopModus = window.innerWidth > 900;
  }

  /**
   * Handles mouse enter event by setting the mask size on the targeted element.
   * Adjusts the CSS mask-size property to create the mask effect.
   */
  onMouseEnter() {
    const underneathEl = this.el.nativeElement.querySelector('.underneath');
    this.renderer.setStyle(underneathEl, 'mask-size', `${this.maskSize}px`);
  }

  /**
   * Handles mouse leave event by resetting the mask size to 0.
   * This effectively hides the mask when the mouse leaves the target area.
   */
  onMouseLeave() {
    const underneathEl = this.el.nativeElement.querySelector('.underneath');
    this.renderer.setStyle(underneathEl, 'mask-size', '0px');
  }

  /**
   * Tracks mouse movement over the component and dynamically updates the mask position.
   * The mask effect is only applied if the screen width is greater than 900px.
   *
   * @param {MouseEvent} event - The mousemove event.
   */
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (window.innerWidth > 900) {
      const rect = this.el.nativeElement.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      if (window.innerWidth <= 1200) {
        this.offsetY = 175;
        this.offsetX = 50;
      }
      const maskPositionX = `${mouseX - this.maskSize / 2 - this.offsetX}px`;
      const maskPositionY = `${mouseY - this.maskSize / 2 - this.offsetY}px`;
      this.renderer.setStyle(
        this.el.nativeElement.querySelector('.underneath'),
        'mask-position',
        `${maskPositionX} ${maskPositionY}`
      );
    }
  }

  /**
   * Scrolls the page to the 'About Me' section.
   * Locates the element by its ID and triggers smooth scrolling.
   */
  scrollToAboutMe() {
    const element = document.getElementById('aboutMe-section');
    if (element) element.scrollIntoView();
  }

  /**
   * Scrolls the page to the 'Contact' section.
   * Locates the element by its ID and triggers smooth scrolling.
   */
  scrollToContact() {
    const element = document.getElementById('contact-section');
    if (element) element.scrollIntoView();
  }
}
