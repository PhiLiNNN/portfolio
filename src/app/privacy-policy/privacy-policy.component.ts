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
  selector: 'app-privacy-policy',
  imports: [RouterModule, TranslateModule],
  templateUrl: './privacy-policy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicyComponent implements OnInit {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    if (this.isBrowser) window.scrollTo({ top: 0 });
    this.seo.set({ titleKey: 'seo.privacy.title', descriptionKey: 'seo.privacy.description' });
  }
}
