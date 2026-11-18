import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { isNightShift } from '../night-shift';
import { ScrollService } from '../scroll.service';
import { TOPICS } from '../../topics/topics';
import { VideoDialogService } from '../video-dialog.service';

@Component({
  selector: 'app-footer',
  imports: [TranslateModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly topics = TOPICS;
  /** Between 0:00 and 4:59 local time a second line appears under the copyright. */
  readonly night = signal(false);

  ngOnInit(): void {
    if (this.isBrowser) this.night.set(isNightShift(new Date()));
  }

  private readonly scroll = inject(ScrollService);
  private readonly video = inject(VideoDialogService);
  readonly year = new Date().getFullYear();

  top(): void {
    this.scroll.top();
  }

  openVideo(): void {
    this.video.open();
  }
}
