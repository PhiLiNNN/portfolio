import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollService } from '../../shared/scroll.service';

@Component({
  selector: 'app-about',
  imports: [TranslateModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  private readonly scroll = inject(ScrollService);

  toContact(): void {
    void this.scroll.to('contact');
  }
}
