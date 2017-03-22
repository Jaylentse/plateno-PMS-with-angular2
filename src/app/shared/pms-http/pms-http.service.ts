import { Subject } from 'rxjs/Rx';
import { Scheduler } from 'rxjs/Scheduler';
import { Confirm, ConfirmFeedback, ConfirmService } from './../confirm/confirm.service';
import { HttpInterceptorBackend } from './http-interceptor-backend.service';
import { Http, RequestOptions, Response } from '@angular/http';
import { EventEmitter, Injectable } from '@angular/core';

const METHODS = [
  'request',
  'get',
  'post',
  'put',
  'delete',
  'patch',
  'head',
  'options'
];

/**
 * @description
 *
 * @export
 * @class PmsHttp
 * @extends {Http}
 */
@Injectable()
export class PmsHttp extends Http {

  private _lastConfirmFeedback: ConfirmFeedback = null;

  constructor(
    private httpInterceptorBackend: HttpInterceptorBackend,
    private requestOptions: RequestOptions,
    private confirmService: ConfirmService
  ) {
    super(httpInterceptorBackend, requestOptions);
  }

  /**
   * @description 用于需要确认后再请求的接口，可阻塞请求直至用户点击确认
   *
   * @param {string} message
   * @param {string} [okButtonName]
   * @param {string} [cancelButtonName]
   * @returns  {object} {
   *                      request: Function,
   *                      post: Function,
   *                      confirm: Function,
   *                      ...
   *                    }
   *
   * @memberOf PmsHttp
   */
  confirm(message: string, okButtonName?: string, cancelButtonName?: string) {
    const access = this.createConfirmAccess(message, okButtonName, cancelButtonName);

    return access;
  }

  createConfirmAccess(message: string, okButtonName?: string, cancelButtonName?: string) {
    const access: any = {};
    // 生成发射confirm的payload
    const confirmAddition = this.confirmService.generatePayload(message, okButtonName, cancelButtonName);

    // 发射confirm事件
    const emitConfirm = () => {
      if (this._lastConfirmFeedback && !this._lastConfirmFeedback.closed) {

        this._lastConfirmFeedback.subscribe(result => {
          if (result === true) {
            this.confirmService.confirmListener.emit(confirmAddition);
          }
          this._lastConfirmFeedback.complete();
        });

      } else {
        this.confirmService.confirmListener.emit(confirmAddition);
      }
      this._lastConfirmFeedback = confirmAddition.feedback;
    };

    for (const method of METHODS) {

      access[ method ] = (...requestArgs) => {
        // http服务返回的可观察对象及其订阅者的中间桥梁
        const requestObservable = new Subject<Response>();
        confirmAddition.feedback.distinct().subscribe(result => {
          if (result === true) {
            super[ method ].apply(this, requestArgs).subscribe(requestObservable);
          }
          if (result === false) {
            confirmAddition.feedback.complete();
          }
        });
        // this.confirmService.confirmListener.emit(confirmAddition);
        return requestObservable;
      };

    }
    // 添加confirm方法以方便链式调用
    access.confirm = (...confirmArgs) => {
      return this.confirm.apply(this, confirmArgs);
    };

    emitConfirm();

    // 将入口返回
    return access;
  }
}

export function httpFactory(
  httpInterceptorBackend: HttpInterceptorBackend,
  requestOptions: RequestOptions,
  confirmService: ConfirmService
): Http {
  return new PmsHttp(httpInterceptorBackend, requestOptions, confirmService);
}

