import { Injectable } from '@angular/core';

/** Lets any component open the one Empty-Handed video dialog in the app shell. */
@Injectable({ providedIn: 'root' })
export class VideoDialogService {
  private opener?: () => void;

  register(open: () => void): void {
    this.opener = open;
  }

  open(): void {
    this.opener?.();
  }
}
