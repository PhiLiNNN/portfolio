import {
  Component,
  Input,
  Output,
  EventEmitter,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  /**
   * Indicates whether the menu is currently open.
   * @type {boolean | null}
   */
  @Input() menuOpen: boolean | null = null;

  /**
   * Event emitter that emits an event when the menu is toggled.
   * @type {EventEmitter<void>}
   */
  @Output() menuToggle = new EventEmitter<void>();

  /**
   * Constructor that injects Renderer2 and Router services.
   *
   * @param {Renderer2} renderer - Service for manipulating DOM elements and styles.
   * @param {Router} router - Angular Router service for navigation.
   */
  constructor(private renderer: Renderer2, private router: Router) {}

  /**
   * Closes the menu and restores the page overflow style.
   * Emits a `menuToggle` event to notify parent components of the menu closure.
   */
  closeMenu() {
    this.menuOpen = false;
    this.renderer.removeStyle(document.body, 'overflow');
    this.menuToggle.emit();
  }

  /**
   * Navigates to a specific section of the application.
   * Closes the menu before navigating and scrolling to the specified section.
   * If the current route is not the root, navigates to the root first to ensure a clean scroll.
   *
   * @param {string} section - The ID of the section to scroll to.
   */
  async navigateToSection(section: string) {
    this.closeMenu();
    if (this.router.url !== '/') {
      await this.router.navigate(['/']);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    this.scrollToSection(section);
  }

  /**
   * Scrolls the window to a specified section by its ID.
   *
   * @param {string} section - The ID of the section to scroll to.
   */
  scrollToSection(section: string): void {
    const element = document.getElementById(section);
    if (element) element.scrollIntoView();
  }
}
