import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ScrollService } from '../shared/scroll.service';
import { SeoService } from '../shared/seo.service';
import { TOPICS, Topic } from './topics';

interface TopicContent {
  title: string;
  seoTitle: string;
  description: string;
  intro: string;
  sections: { h: string; p: string }[];
  stack: string[];
}

@Component({
  selector: 'app-topic',
  imports: [TranslateModule, RouterModule],
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicComponent implements OnInit {
  /** Bound from route data via withComponentInputBinding. */
  readonly key = input.required<Topic['key']>();

  private readonly translate = inject(TranslateService);
  private readonly seo = inject(SeoService);
  private readonly scroll = inject(ScrollService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly all = toSignal(this.translate.stream('topics'), {
    initialValue: {} as Record<string, TopicContent>,
  });

  readonly content = computed<TopicContent | null>(() => {
    const c = this.all()[this.key()];
    return c && typeof c === 'object' ? c : null;
  });
  readonly topic = computed(() => TOPICS.find((t) => t.key === this.key())!);
  readonly others = computed(() => TOPICS.filter((t) => t.key !== this.key()));

  ngOnInit(): void {
    if (this.isBrowser) window.scrollTo({ top: 0 });
    this.seo.set({ titleKey: `topics.${this.key()}.seoTitle`, descriptionKey: `topics.${this.key()}.description` });
  }

  toContact(): void {
    void this.scroll.to('contact');
  }
}
