import { Component, OnInit } from '@angular/core';
import { ReferenceLeftComponent } from '../shared/referenceLeft/referenceLeft.component';
import { ReferenceRightComponent } from '../shared/referenceRight/referenceRight.component';
import {
  TranslateModule,
  TranslateService,
  LangChangeEvent,
} from '@ngx-translate/core';

interface Reference {
  name: string;
  skills: string[];
  description: string;
  githubLink: string;
  liveLink: string;
  img: string;
}
@Component({
  selector: 'app-references',
  standalone: true,
  imports: [ReferenceLeftComponent, ReferenceRightComponent, TranslateModule],
  templateUrl: './references.component.html',
  styleUrl: './references.component.scss',
})
export class ReferencesComponent implements OnInit {
  references: Reference[] = [];

  /**
   * Initializes a new instance of the ReferencesComponent class.
   * The TranslateService is injected to handle translations and language changes.
   *
   * @param {TranslateService} translate - The translation service used to fetch localized content.
   */
  constructor(private translate: TranslateService) {
    this.translate.get('references').subscribe((translations: any) => {
      this.references = translations;
    });
  }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Subscribes to language change events to update the reference list dynamically.
   */
  ngOnInit(): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.references = event.translations.references;
    });
  }
}
