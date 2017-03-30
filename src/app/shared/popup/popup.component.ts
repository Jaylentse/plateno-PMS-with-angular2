import { animationFrame } from 'rxjs/scheduler/animationFrame';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { OnDestroy } from '@angular/core/core';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit, EventEmitter, ElementRef, Input, Output, Renderer2, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: [ './popup.component.scss' ]
})
export class PopupComponent implements OnInit, AfterViewInit, OnDestroy {

  _width = 360;
  _height = 180;
  _translateX = 0;
  _translateY = 0;

  @ViewChild('popupHeader') header: ElementRef;
  @ViewChild('popup') popup: ElementRef;

  @Input()
  set width(width: number | string) {
    if (typeof width === 'number') {
      this._width = width;
    } else {
      this._width = parseFloat(width);
    }
  }
  get width() {
    return this._width + 'px';
  }

  @Input()
  set height(height: number | string) {
    if (typeof height === 'number') {
      this._height = height;
    } else {
      this._height = parseFloat(height);
    }
  }
  get height() {
    return this._height + 'px';
  }

  set popupHeight(height: number | string) { }
  get popupHeight() {
    return this._height + 40 + 'px';
  }

  @Input()
  set translate(translate: string | SafeStyle) {
    console.log(translate);
    if (typeof translate === 'string') {
      const distance = translate.split(',');
      const translateX = parseFloat(distance[ 0 ]);
      const translateY = parseFloat(distance[ 1 ]);

      this._translateX = translateX;
      this._translateY = translateY;
    }
  }
  get translate() {
    return this.sanitizer.bypassSecurityTrustStyle(`translate(${this._translateX}px, ${this._translateY}px)`);
  }

  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private renderer: Renderer2,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    const dragStart = Observable.fromEvent<MouseEvent>(this.header.nativeElement, 'mousedown')
      .filter(e => e.button === 0);

    const dragging = dragStart.switchMap(() =>
      Observable
        .fromEvent(window, 'mousemove')
        .takeUntil(Observable.fromEvent(window, 'mouseup'))
    );

    dragStart
      .map(e => {
        const disX = e.clientX - this.popup.nativeElement.offsetLeft;
        const disY = e.clientY - this.popup.nativeElement.offsetTop;
        return { disX, disY };
      })
      .combineLatest(dragging, (dis, e: MouseEvent) => {
        const clientX = e.clientX;
        const clientY = e.clientY;
        const left = clientX - dis.disX + 'px';
        const top = clientY - dis.disY + 'px';
        return {
          clientX,
          clientY,
          left,
          top
        };
      })
      .distinctUntilChanged((prev, cur) =>
        (prev.clientX === cur.clientX && prev.clientY === prev.clientY) ||
        (prev.left === cur.left && prev.top === prev.top)
      )
      // .subscribeOn(animationFrame)
      .subscribe(pos => {
        this.renderer.setStyle(this.popup.nativeElement, 'margin', 0);
        this.renderer.setStyle(this.popup.nativeElement, 'left', pos.left);
        this.renderer.setStyle(this.popup.nativeElement, 'top', pos.top);
      });

  }

  ngOnDestroy() {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.

  }

  closePopup() {
    this.close.emit();
  }

}
