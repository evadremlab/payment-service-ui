import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appOnlynumber]'
})
export class OnlynumberDirective {
  @Input() NumericInput: boolean;
  @Input() latestInputValue: number;
  private regex: RegExp = new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-'];

  constructor(private el: ElementRef) {
  }  

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    let e = <KeyboardEvent>event;
    if (this.specialKeys.indexOf(e.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(e.key);
    if (next && !String(next).match(this.regex)) {
      e.preventDefault();
    }
  }

}
