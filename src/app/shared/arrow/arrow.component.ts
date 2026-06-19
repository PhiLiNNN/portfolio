import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-arrow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './arrow.component.html',
  styleUrl: './arrow.component.scss',
})
export class ArrowComponent {
  private animationPlayed = false;

  @Input() alignment: 'left' | 'right' = 'left';
  @Input() sectionId: string = this.generateUniqueId();
  @Input() maxOffset = 4;
  @Input() ariaLabel = '';
  @Output() activate = new EventEmitter<void>();

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  @HostListener('window:scroll')
  onScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.animationPlayed) return;

    const element = this.el.nativeElement.querySelector('.index-arrow');
    if (!element) return;

    const rect = element.getBoundingClientRect();

    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    const isElementInViewport = rect.top >= 0 && rect.bottom <= viewportHeight;

    if (isElementInViewport) {
      this.triggerAnimation('forward');
      this.animationPlayed = true;
    }
  }

  triggerAnimation(direction: 'forward'): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Respect reduced-motion: SMIL <animate> isn't covered by the CSS media query.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const animElement = document.getElementById(
      this.sectionId
    ) as SVGAnimateElement | null;

    animElement?.beginElement();
  }

  private generateUniqueId(): string {
    return `section_${Math.random().toString(36).slice(2, 11)}`;
  }
}
