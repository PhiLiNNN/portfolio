import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AotComponent } from './../aot/aot.component';
import { AboutMeComponent } from './../aboutMe/aboutMe.component';
import { SkillsComponent } from './../skills/skills.component';
import { ServicesOfferComponent } from './../services-offer/services-offer.component';
import { ReferencesComponent } from './../references/references.component';
import { ArrowComponent } from '../shared/arrow/arrow.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-main-content',
  standalone: true,
  imports: [
    AotComponent,
    AboutMeComponent,
    SkillsComponent,
    ServicesOfferComponent,
    ReferencesComponent,
    ArrowComponent,
    TranslateModule,
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  scrollTo(section: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }
}
