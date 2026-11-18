import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SeoService } from '../shared/seo.service';

@Component({
  selector: 'app-imprint',
  imports: [TranslateModule, RouterModule],
  templateUrl: './imprint.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImprintComponent implements OnInit {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    if (this.isBrowser) window.scrollTo({ top: 0 });
    this.seo.set({ titleKey: 'seo.imprint.title', descriptionKey: 'seo.imprint.description' });
  }
}
