import { Component, Input, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-referenceRight',
  standalone: true,
  imports: [],
  templateUrl: './referenceRight.component.html',
  styleUrl: './referenceRight.component.scss',
})
export class ReferenceRightComponent {
  @Input() skills: string = '';
  @Input() name: string = '';
  @Input() refNum: number = 0;
  @Input() refAll: number = 0;
  @Input() description: string = '';
  @Input() imageUrl: string = '';

  private observer: IntersectionObserver;
  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.observer = new IntersectionObserver((entries) => {
      const refFlexElement = this.el.nativeElement.querySelector('.ref-flex');
      entries.forEach((entry) => {
        if (entry.isIntersecting)
          this.renderer.addClass(refFlexElement, 'show');
      });
    });
  }

  ngAfterViewInit() {
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}
