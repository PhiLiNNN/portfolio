import { Component, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-aot',
  standalone: true,
  imports: [],
  templateUrl: './aot.component.html',
  styleUrl: './aot.component.scss',
})
export class AotComponent {
  offsetX: number = 73;
  offsetY: number = 243;
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  onMouseEnter() {
    this.renderer.setStyle(
      this.el.nativeElement.querySelector('.underneath'),
      'mask-size',
      '150px'
    );
    this.renderer.setStyle(
      this.el.nativeElement.querySelector('.underneath'),
      'transition',
      'mask-size 0.3s ease'
    );
  }
  onMouseLeave() {
    const underneathElement =
      this.el.nativeElement.querySelector('.underneath');
    this.renderer.setStyle(underneathElement, 'mask-size', '0px');
    this.renderer.setStyle(
      underneathElement,
      'transition',
      'mask-size 0.3s ease'
    );
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const maskPositionX = `${mouseX - this.offsetX}px`;
    const maskPositionY = `${mouseY - this.offsetY}px`;

    this.renderer.setStyle(
      this.el.nativeElement.querySelector('.underneath'),
      'mask-position',
      `${maskPositionX} ${maskPositionY}`
    );
  }
}
