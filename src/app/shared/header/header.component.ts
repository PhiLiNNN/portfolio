import {
  Component,
  EventEmitter,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
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
  @Input() scrollToBottomBool: boolean | undefined;
  @Input() testVariable: boolean | undefined;

  constructor(
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
}
