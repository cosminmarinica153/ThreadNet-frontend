import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appTruncate]'
})
export class TruncateDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    const paragraph = this.elementRef.nativeElement;
    const lineHeight = 25;
    const maxLines = 3;
    const maxHeight = lineHeight * maxLines;

    if (paragraph.offsetHeight > maxHeight) {
      paragraph.style.maxHeight = maxHeight + 'px';
      paragraph.classList.add('overflow-ellipsis');
    }
  }
}
