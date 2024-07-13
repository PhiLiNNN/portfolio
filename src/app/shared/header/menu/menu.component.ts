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

  navigateToSection(section: string) {
    this.closeMenu();
    setTimeout(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([], { fragment: section });
      });
    }, 10);
  }
}
