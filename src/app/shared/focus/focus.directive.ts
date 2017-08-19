import {Directive, ElementRef, AfterViewInit, HostListener} from '@angular/core';


/**
 * Directive applicable sur les element de type Input
 *
 * - Permet de donner le focus à l'élément de type Input associé lors de sa création
 * - Supprime le focus lors de l'appuie du la touche "enter"
 */


@Directive({
    selector: 'input[abFocus]'
})
export class FocusDirective implements AfterViewInit {

    public elRef: ElementRef;

    constructor(elRef: ElementRef) {
        this.elRef = elRef;
    }

    public ngAfterViewInit(): void {
        let el: HTMLInputElement = this.elRef.nativeElement;
        el.focus();
        // el.setSelectionRange(0, el.value.length);
        el.select();
    }





}
