import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  @Input() menuOpen: boolean | null = null;
  @Output() menuToggle = new EventEmitter<void>();

  constructor(
    private renderer: Renderer2,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  closeMenu(): void {
    this.menuOpen = false;

    if (this.isBrowser) {
      this.renderer.removeStyle(document.body, 'overflow');
    }

    this.menuToggle.emit();
  }

  async navigateToSection(section: string): Promise<void> {
    if (this.isBrowser) {
      const eventName = `menu_${this.normalizeSection(section)}`;
      window.umami?.track(eventName);
    }

    this.closeMenu();

    if (this.router.url !== '/') {
      await this.router.navigate(['/']);

      if (this.isBrowser) {
        await new Promise((r) => setTimeout(r, 100));
      }
    }

    this.scrollToSection(section);
  }

  private normalizeSection(section: string): string {
    return section.replace('-section', '').toLowerCase();
  }

  private scrollToSection(section: string): void {
    if (!this.isBrowser) return;

    const el = document.getElementById(section);
    el?.scrollIntoView({ behavior: 'smooth' });
  }
}
