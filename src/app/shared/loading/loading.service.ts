import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class LoadingService {

  loadingListener: EventEmitter<boolean>;

  constructor() {
    this.loadingListener = new EventEmitter<boolean>();
  }

  beginLoading() {
    this.loadingListener.emit(true);
  }

  finishLoading() {
    this.loadingListener.emit(false);
  }
}
