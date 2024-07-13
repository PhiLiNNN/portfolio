import { Component, EventEmitter, Output, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MenuComponent, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Output() menuOpenChange = new EventEmitter<boolean>();
  menuOpen: boolean | null = null;
  constructor(
    private router: Router,
    private renderer: Renderer2,
    private translate: TranslateService
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

  backToMainPage() {
    this.router.navigate(['/']);
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  }
}
