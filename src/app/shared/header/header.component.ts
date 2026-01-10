import {
  Component,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
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
  @Output() menuOpenChange = new EventEmitter<boolean>();

  isLenMenuOpen = false;
  menuOpen: boolean | null = null;

  @Input() scrollToBottomBool: boolean | undefined;
  @Input() testVariable: boolean | undefined;

  constructor(
    private renderer: Renderer2,
    private translate: TranslateService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.translate.setDefaultLang('en');
  }

  switchLanguage(language: string): void {
    this.translate.use(language);
  }

  toggleMenu(): void {
    if (this.menuOpen === null) this.menuOpen = false;
    this.menuOpen = !this.menuOpen;
    this.menuOpenChange.emit(this.menuOpen);

    if (!isPlatformBrowser(this.platformId)) return;

    if (this.menuOpen) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    } else {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  backToHome(home: string): void {
    if (isPlatformBrowser(this.platformId) && home) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.router.navigateByUrl('/');
  }

  toggleLenMenu(): void {
    this.isLenMenuOpen = !this.isLenMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const clickedElement = event.target as HTMLElement;
    const menuElement = document.querySelector(
      '.menu-ri'
    ) as HTMLElement | null;

    if (menuElement && !menuElement.contains(clickedElement)) {
      this.isLenMenuOpen = false;
    }
  }

  closeLenMenu(): void {
    this.isLenMenuOpen = false;
  }
}
