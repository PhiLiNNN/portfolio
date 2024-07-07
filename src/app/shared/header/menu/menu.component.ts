import {
  Component,
  Input,
  Output,
  EventEmitter,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
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

  constructor(private renderer: Renderer2) {}

  closeMenu() {
    this.menuOpen = false;
    this.renderer.removeStyle(document.body, 'overflow');
    this.menuToggle.emit();
  }

  scrollTo(section: string) {
    this.closeMenu();

    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
