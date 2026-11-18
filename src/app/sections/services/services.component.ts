import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface ServiceCard {
  title: string;
  text: string;
  tags: string[];
}

@Component({
  selector: 'app-services',
  imports: [TranslateModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {
  private readonly translate = inject(TranslateService);
  private readonly keys = ['card1', 'card2', 'card3'];

  /** Cards follow the active language (tags are arrays, so no pipe). */
  readonly cards = toSignal(this.translate.stream('services'), {
    initialValue: {} as Record<string, ServiceCard>,
  });

  get list(): ServiceCard[] {
    const all = this.cards();
    return this.keys
      .map((k) => all[k])
      .filter((c): c is ServiceCard => !!c && typeof c === 'object');
  }
}
