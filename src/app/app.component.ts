import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from './analytics.service';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { VideoDialogComponent } from './shared/video-dialog/video-dialog.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule, HeaderComponent, FooterComponent, VideoDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor() {
    inject(AnalyticsService).init();

    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      // For the people who open the dev tools.
      console.log(
        '%c PW ',
        'background:#b48cff;color:#1b0f33;font-weight:800;padding:4px 8px;border-radius:6px',
        'Angular 21 mit SSR, keine Tracker, Fonts selbst gehostet.\nFragen zum Code oder ein Projekt: contact@philipp-wendschuch.dev'
      );
    }
  }
}
