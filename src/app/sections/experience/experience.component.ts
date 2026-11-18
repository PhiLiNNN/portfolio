import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RevealDirective } from '../../shared/reveal.directive';

/** Co-founder entries: Webwerk Leipzig (with backlink) and traudel.app. */
@Component({
  selector: 'app-experience',
  imports: [RevealDirective, TranslateModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceComponent {
  private readonly translate = inject(TranslateService);
  readonly traudelTags = toSignal(this.translate.stream('experience.traudel.tags'), {
    initialValue: [] as string[],
  });

  get tags(): string[] {
    const t = this.traudelTags();
    return Array.isArray(t) ? t : [];
  }
}
