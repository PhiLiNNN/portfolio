import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[mouse]',
})
export class MouseDirective {
  constructor() {}

  @HostListener('mouseenter')
  onMouseEnter() {
    console.log("OMG It's a Mouse!!!");
  }

  @HostListener('mouseover')
  onMouseOver() {
    console.log("OMG It's still here!!!");
  }

  @HostListener('mouseout')
  onMouseOut() {
    console.log('Phew thank god it left!');
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    console.log('It really left right');
  }
}
