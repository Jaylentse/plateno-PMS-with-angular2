import { Observable, Subject } from 'rxjs/Rx';
import { Scheduler } from 'rxjs/Scheduler';
import { Confirm, ConfirmService } from './../confirm/confirm.service/confirm.service';
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

// 为confirm方法的返回值创建ConfirmOutlet接口，方便调用者调用返回的方法
interface ConfirmOutlet extends Http {
  confirm: (message: any, okButtonNameOrTriggrt: any, cancelButtonName?: any, trigger?: any) => ConfirmOutlet;
}

/**
 * @description
 *
 * @export
 * @class PmsHttp
 * @extends {Http}
 */
@Injectable()
export class PmsHttp extends Http {

  constructor(
    private httpInterceptorBackend: HttpInterceptorBackend,
    private requestOptions: RequestOptions,
    private confirmService: ConfirmService
  ) {
    super(httpInterceptorBackend, requestOptions);
  }


  /**
   * @description
   *
   * @param {string} message
   * @param {string} okButtonNameOrTriggrt
   * @param {string} cancelButtonName
   * @param {boolean} trigger
   * @param {[ any ]} [confirmChain]
   *
   * @memberOf PmsHttp
   */
  confirm(message: string, okButtonNameOrTriggrt: string, cancelButtonName: string, trigger?: boolean): ConfirmOutlet
  confirm(message: string, okButtonNameOrTriggrt?: boolean): ConfirmOutlet
  confirm(message: any, okButtonNameOrTriggrt: any = true, cancelButtonName?: any, trigger: any = true): ConfirmOutlet {
    let outlet = null;
    switch (typeof okButtonNameOrTriggrt) {
      case 'string':
        outlet = this.createConfirmOutlet(message, okButtonNameOrTriggrt, cancelButtonName, trigger, []);
        break;
      case 'boolean':
        outlet = this.createConfirmOutlet(message, okButtonNameOrTriggrt, []);
        break;
    }
    return outlet;
  }



  /**
   * @description 创建confirm方法返回的接口，根据参数中有无自定义确认按钮文本和自定义取消按钮文本重载两次
   *
   * @protected
   * @param {string} message                                            想要确认的信息文本： 例如： 确定要退房吗
   * @param {string | boolean} okButtonNameOrTriggrt                    自定义确认按钮文本①或确认事件触发器②
   *                                                                      ①. 例如: 继续 | 跳过 | ...（缺省值为 确认）；
   *                                                                      ②. 一个判断表达式，true则触发confirm事件，false则跳过
   * @param {string | Array<Confirm>} cancelButtonNameOrConfirmChain    自定义取消按钮文本③或确认队列④
   *                                                                      ③. 例如：放弃 | 返回 | ... (缺省值为 取消)
   *                                                                      ④. 确认事件队列，将依次触发队列中的确认事件
   * @param {boolean} trigger                                           事件触发器，参照②
   * @param {Array<Confirm>} confirmChain                               确认队列，参照④
   *
   * @return ConfirmOutlet
   *
   * @memberOf PmsHttp
   */
  protected createConfirmOutlet(message: string, okButtonNameOrTriggrt: string, cancelButtonNameOrConfirmChain: string, trigger: boolean,
    confirmChain: Array<Confirm>): ConfirmOutlet
  protected createConfirmOutlet(message: string, okButtonNameOrTriggrt: boolean,
    cancelButtonNameOrConfirmChain: Array<Confirm>): ConfirmOutlet
  protected createConfirmOutlet(message: any, okButtonNameOrTriggrt: any, cancelButtonNameOrConfirmChain?: any, trigger?: any,
    confirmChain?: Array<Confirm>): ConfirmOutlet {
    const outlet: any = {};
    let confirmPayload: Confirm = null;
    let emitTrigger = true;
    // 生成发射confirm的payload
    if (typeof okButtonNameOrTriggrt === 'string') {
      confirmPayload = this.confirmService.generatePayload(message, okButtonNameOrTriggrt, cancelButtonNameOrConfirmChain);
      emitTrigger = trigger;
    } else {
      confirmPayload = this.confirmService.generatePayload(message);
      emitTrigger = okButtonNameOrTriggrt;
      confirmChain = cancelButtonNameOrConfirmChain;
    }

    if (emitTrigger) {
      confirmChain.push(confirmPayload);
    }

    for (const method of METHODS) {

      outlet[ method ] = (...requestArgs) => {
        // http服务返回的可观察对象及其订阅者的中间桥梁
        const requestObservable = new Subject<Response>();
        let confirmChain$: Observable<boolean> = null;
        // 归并mergeMap confirmChain
        confirmChain$ = confirmChain
          .map(_ => _.feedback)
          .reduceRight((prev, cur, i, chain) => {
            // confirm链中最后一个confirm
            if (i === chain.length - 1) {
              return cur
                .do(res => {
                  if (res === true) {
                    // 如果确认最后一个confirm则将请求订阅到requestObservable上
                    super[ method ].apply(this, requestArgs).subscribe(requestObservable);
                  }
                  // 返回一个空observable释放confirm链
                  return Observable.empty();
                });
            };

            return cur.mergeMap(res => {
              // 确认上一个confirm
              if (res === true) {

                // 发射下一个confirm
                this.confirmService.confirmListener.emit(confirmChain[ i + 1 ]);

                // 返回归并结果
                return prev;
              }

              // 如果取消了上一个confirm则返回一个空observable结束整个confirm链
              return Observable.empty();
            });
          }, null);

        confirmChain$.subscribe();
        this.confirmService.confirmListener.emit(confirmChain[ 0 ]);

        return requestObservable;
      };

    }
    // 添加confirm方法以方便链式调用 (this.http.confirm(...args).confirm(...args).post(...args))
    outlet.confirm = (...confirmArgs) => {
      // 如果confirm参数没有传入trigger则默认传一个true
      if (typeof confirmArgs[ confirmArgs.length - 1 ] !== 'boolean') {
        confirmArgs.push(true);
      }

      // 将confirm链传到下一个confirm事件中
      confirmArgs.push(confirmChain);
      return this.createConfirmOutlet.apply(this, confirmArgs);
    };

    // 将入口返回
    return outlet;
  }


}

// 通过工厂函数创建一个http服务
export function httpFactory(
  httpInterceptorBackend: HttpInterceptorBackend,
  requestOptions: RequestOptions,
  confirmService: ConfirmService
): Http {
  return new PmsHttp(httpInterceptorBackend, requestOptions, confirmService);
}

