import {
  Component,
  HostListener,
  ElementRef,
  Renderer2,
  Inject,
  PLATFORM_ID,
  OnInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-aot',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './aot.component.html',
  styleUrls: ['./aot.component.scss'],
})
export class AotComponent implements OnInit {
  desktopModus = false;
  maskSize = 200;
  offsetX = 100;
  offsetY = 175;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.desktopModus = window.innerWidth > 900;
    }
  }

  onMouseEnter(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const underneathEl = this.el.nativeElement.querySelector('.underneath');
    if (!underneathEl) return;

    this.renderer.setStyle(underneathEl, 'mask-size', `${this.maskSize}px`);
  }

  onMouseLeave(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const underneathEl = this.el.nativeElement.querySelector('.underneath');
    if (!underneathEl) return;

    this.renderer.setStyle(underneathEl, 'mask-size', '0px');
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (window.innerWidth <= 900) return;

    const rect = this.el.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (window.innerWidth <= 1200) {
      this.offsetY = 175;
      this.offsetX = 50;
    }

    const maskPositionX = `${mouseX - this.maskSize / 2 - this.offsetX}px`;
    const maskPositionY = `${mouseY - this.maskSize / 2 - this.offsetY}px`;

    const underneathEl = this.el.nativeElement.querySelector('.underneath');
    if (!underneathEl) return;

    this.renderer.setStyle(
      underneathEl,
      'mask-position',
      `${maskPositionX} ${maskPositionY}`
    );
  }

  scrollToAboutMe(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    document
      .getElementById('aboutMe-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToContact(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    document
      .getElementById('contact-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  }
}
