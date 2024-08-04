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
  @Output() menuOpenChange = new EventEmitter<boolean>();
  isLenMenuOpen = false;
  menuOpen: boolean | null = null;
  @Input() scrollToBottomBool: boolean | undefined;
  @Input() testVariable: boolean | undefined;

  constructor(
    private renderer: Renderer2,
    private translate: TranslateService,
    private router: Router
  ) {
    this.translate.setDefaultLang('en');
  }

  switchLanguage(languge: string) {
    this.translate.use(languge);
  }

  toggleMenu(): void {
    if (this.menuOpen === null) this.menuOpen = false;
    this.menuOpen = !this.menuOpen;
    this.menuOpenChange.emit(this.menuOpen);
    if (this.menuOpen)
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    else this.renderer.removeStyle(document.body, 'overflow');
  }

  backToHome() {
    setTimeout(() => {
      this.router.navigateByUrl('/');
    }, 10);
  }
  toggleLenMenu(): void {
    this.isLenMenuOpen = !this.isLenMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    const menuElement = document.querySelector('.menu-ri') as HTMLElement;

    if (menuElement && !menuElement.contains(clickedElement)) {
      this.isLenMenuOpen = false;
    }
  }
  closeLenMenu(): void {
    if ((this.isLenMenuOpen = true)) this.isLenMenuOpen = false;
  }
}
