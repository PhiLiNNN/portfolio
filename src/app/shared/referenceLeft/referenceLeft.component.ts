import { Component, Input, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-referenceLeft',
  standalone: true,
  imports: [],
  templateUrl: './referenceLeft.component.html',
  styleUrl: './referenceLeft.component.scss',
})
export class ReferenceLeftComponent {
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
