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
  @Input() menuOpen: boolean | null = null;
  @Output() menuToggle = new EventEmitter<void>();

  constructor(private renderer: Renderer2, private router: Router) {}

  closeMenu() {
    this.menuOpen = false;
    this.renderer.removeStyle(document.body, 'overflow');
    this.menuToggle.emit();
  }

  async navigateToSection(section: string) {
    this.closeMenu();
    if (this.router.url !== '/') {
      await this.router.navigate(['/']);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    this.scrollToSection(section);
  }

  scrollToSection(section: string): void {
    const element = document.getElementById(section);
    if (element) element.scrollIntoView();
  }
}
