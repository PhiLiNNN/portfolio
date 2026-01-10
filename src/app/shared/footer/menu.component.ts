import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [TranslateModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  backToTop(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
