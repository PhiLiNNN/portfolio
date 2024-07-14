import {
  Component,
  HostListener,
  Input,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-arrow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './arrow.component.html',
  styleUrl: './arrow.component.scss',
})
export class ArrowComponent {
  private animationPlayed: boolean = false;
  @Input() alignment: 'left' | 'right' = 'left';
  @Input() sectionId: string = this.generateUniqueId();
  @Input() maxOffset: number = 4;
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    const element = this.elementRef.nativeElement.querySelector('.index-arrow');
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const isElementInViewport =
      rect.top >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight);

    if (isElementInViewport && !this.animationPlayed) {
      this.triggerAnimation('forward');
      this.animationPlayed = true;
    }
  }

  private animationState: 'idle' | 'animatingForward' = 'idle';

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  triggerAnimation(direction: 'forward' | 'backward'): void {
    const animationId =
      direction === 'forward' ? this.sectionId : `${this.sectionId}return`;
    const animElement = document.getElementById(
      animationId
    ) as SVGAnimateElement | null;

    if (animElement) {
      animElement.beginElement();
      this.animationState = 'animatingForward';
      setTimeout(() => {
        this.animationState = 'idle';
      }, 500);
    }
  }

  private generateUniqueId(): string {
    return `section_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// onMouseEnter() {
//   const toSkillsArrow =
//     this.elementRef.nativeElement.querySelector('.index-arrow');
//   this.renderer.addClass(toSkillsArrow, 'hovered');
// }
