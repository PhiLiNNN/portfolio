import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { VideoDialogService } from '../../shared/video-dialog.service';
import { RevealDirective } from '../../shared/reveal.directive';

interface OffCodeItem {
  key: string;
  warm: boolean;
  video?: boolean;
}

/** "Abseits vom Code": facts that are not in the CV, as modules on the desk. */
@Component({
  selector: 'app-off-code',
  imports: [RevealDirective, TranslateModule],
  templateUrl: './off-code.component.html',
  styleUrl: './off-code.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffCodeComponent {
  private readonly video = inject(VideoDialogService);

  readonly items: OffCodeItem[] = [
    { key: 'climbing', warm: false },
    { key: 'music', warm: true, video: true },
    { key: 'sport', warm: false },
    { key: 'hours', warm: true },
    { key: 'before', warm: false },
    { key: 'drive', warm: true },
  ];

  openVideo(): void {
    this.video.open();
  }
}
