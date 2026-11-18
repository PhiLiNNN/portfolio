import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { VideoDialogService } from '../video-dialog.service';

const VIDEO_URL = 'https://www.youtube-nocookie.com/embed/OoIa7-U1SbE';

/**
 * Native <dialog> with a click-to-load YouTube embed (youtube-nocookie).
 * Nothing is requested from YouTube until the visitor presses "Load video".
 */
@Component({
  selector: 'app-video-dialog',
  imports: [TranslateModule],
  templateUrl: './video-dialog.component.html',
  styleUrl: './video-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoDialogComponent {
  private readonly dlg = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');
  private readonly sanitizer = inject(DomSanitizer);
  readonly loaded = signal(false);
  readonly url: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(VIDEO_URL);

  constructor() {
    inject(VideoDialogService).register(() => this.open());
  }

  open(): void {
    const el = this.dlg().nativeElement;
    if (!el.open) el.showModal();
    window.umami?.track('video_open');
  }

  load(): void {
    this.loaded.set(true);
    window.umami?.track('video_load');
  }

  close(): void {
    this.dlg().nativeElement.close();
  }

  /** Reset so the video stops playing when the dialog is closed. */
  onClose(): void {
    this.loaded.set(false);
  }
}
