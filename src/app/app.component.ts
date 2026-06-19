import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MenuComponent } from './shared/footer/menu.component';
import { ContactComponent } from './shared/contact/contact.component';
import { AnalyticsService } from './analytics.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TranslateModule,
    HeaderComponent,
    MenuComponent,
    ContactComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly analytics = inject(AnalyticsService);
  constructor() {
    this.analytics.init();
  }
}
