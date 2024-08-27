import {
  Component,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MenuComponent, TranslateModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  /**
   * Event emitter that notifies when the menu open state changes.
   * @type {EventEmitter<boolean>}
   */
  @Output() menuOpenChange = new EventEmitter<boolean>();

  /**
   * Indicates if the additional menu (lenMenu) is open.
   * @type {boolean}
   */
  isLenMenuOpen = false;

  /**
   * Indicates whether the menu is open or closed.
   * @type {boolean | null}
   */
  menuOpen: boolean | null = null;

  /**
   * Input property to control scrolling to the bottom.
   * @type {boolean | undefined}
   */
  @Input() scrollToBottomBool: boolean | undefined;

  /**
   * Input property for testing purposes.
   * @type {boolean | undefined}
   */
  @Input() testVariable: boolean | undefined;

  /**
   * Constructor that initializes the component with Renderer2, TranslateService, and Router services.
   * Sets the default language for the translation service.
   *
   * @param {Renderer2} renderer - Service for manipulating DOM elements and styles.
   * @param {TranslateService} translate - Service for handling translations.
   * @param {Router} router - Angular Router service for navigation.
   */
  constructor(
    private renderer: Renderer2,
    private translate: TranslateService,
    private router: Router
  ) {
    this.translate.setDefaultLang('en');
  }

  /**
   * Switches the language of the application based on the provided language code.
   *
   * @param {string} languge - The language code to switch to.
   */
  switchLanguage(languge: string) {
    this.translate.use(languge);
  }

  /**
   * Toggles the state of the menu (open/closed).
   * Emits the updated menu state using the menuOpenChange event emitter.
   * Updates the body's overflow style based on the menu state.
   */
  toggleMenu(): void {
    if (this.menuOpen === null) this.menuOpen = false;
    this.menuOpen = !this.menuOpen;
    this.menuOpenChange.emit(this.menuOpen);
    if (this.menuOpen)
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    else this.renderer.removeStyle(document.body, 'overflow');
  }

  /**
   * Navigates back to the home route after a short delay or back  to the top of the page if user is on mainpage.
   *
   * @param {string} home - identifies that user is on the mainpage.
   */
  backToHome(home: string) {
    if (home) window.scrollTo(0, 0);
    setTimeout(() => {
      this.router.navigateByUrl('/');
    }, 10);
  }

  /**
   * Toggles the state of the additional menu (lenMenu).
   */
  toggleLenMenu(): void {
    this.isLenMenuOpen = !this.isLenMenuOpen;
  }

  /**
   * Closes the additional menu (lenMenu) if a click is detected outside the menu element.
   *
   * @param {MouseEvent} event - The mouse click event.
   */
  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    const menuElement = document.querySelector('.menu-ri') as HTMLElement;
    if (menuElement && !menuElement.contains(clickedElement))
      this.isLenMenuOpen = false;
  }

  /**
   * Closes the additional menu (lenMenu) if it is open.
   */
  closeLenMenu(): void {
    if ((this.isLenMenuOpen = true)) this.isLenMenuOpen = false;
  }
}
