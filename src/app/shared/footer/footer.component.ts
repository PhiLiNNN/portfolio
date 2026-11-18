import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollService } from '../scroll.service';
import { VideoDialogService } from '../video-dialog.service';

@Component({
  selector: 'app-footer',
  imports: [TranslateModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
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
