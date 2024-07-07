import { Component, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-aot',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './aot.component.html',
  styleUrls: ['./aot.component.scss'],
})
export class AotComponent {
  maskSize: number = 200;
  offsetX: number = 100;
  offsetY: number = 175;
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  onMouseEnter() {
    const underneathEl = this.el.nativeElement.querySelector('.underneath');
    this.renderer.setStyle(underneathEl, 'mask-size', `${this.maskSize}px`);
  }

  onMouseLeave() {
    const underneathEl = this.el.nativeElement.querySelector('.underneath');
    this.renderer.setStyle(underneathEl, 'mask-size', '0px');
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (window.innerWidth > 900) {
      const rect = this.el.nativeElement.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      if (window.innerWidth <= 1200) {
        this.offsetY = 175;
        this.offsetX = 50;
      }
      const maskPositionX = `${mouseX - this.maskSize / 2 - this.offsetX}px`;
      const maskPositionY = `${mouseY - this.maskSize / 2 - this.offsetY}px`;
      this.renderer.setStyle(
        this.el.nativeElement.querySelector('.underneath'),
        'mask-position',
        `${maskPositionX} ${maskPositionY}`
      );
    }
  }
  scrollToAboutMe() {
    const element = document.getElementById('aboutMe-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  scrollToFooter() {
    const element = document.getElementById('footer-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
