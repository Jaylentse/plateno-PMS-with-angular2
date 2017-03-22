import { convertValueToOutputAst } from '@angular/compiler/src/output/value_util';
import { Observable, Subject } from 'rxjs/Rx';
import { Request, Response, ResponseOptions, ResponseOptionsArgs, XHRConnection } from '@angular/http';
import { Injectable } from '@angular/core';


/**
 * @description 拦截器函数类型
 *
 * @type {Next}                   拦截器中next函数的类型
 * @type {Interceptor}            拦截器函数的类型
 * @type {ResponseInterceptor}    在拦截器函数中分离处理的处理响应逻辑的拦截器的类型
 *
 * @author Jaylen-Tse <jaylen.tse@platenogroup.com>
 */
type Next = (next: ResponseInterceptor) => void;
type Interceptor = (request: Request, next: Next) => void;
type ResponseInterceptor = (response: Response) => void;


/**
 * @description Http 拦截器服务，用于统一处理http请求前后的逻辑
 *
 * @class HttpInterceptorService
 *
 * @author Jaylen-Tse <jaylen.tse@platenogroup.com>
 */
@Injectable()
export class HttpInterceptor {

  // 超时due(默认10秒)
  private _timeOut = 10000;
  // 请求成功的状态码（restful接口的statusCode）
  private _successStatusCode = '00';
  // 超时状态码
  public errorStatusCode = Symbol('error');

  // 拦截器数组
  private _interceptors: Array<Interceptor> = [];
  private _responseInterceptors: Array<ResponseInterceptor> = [];

  beforeRequest(request: Request): Request {
    this._interceptors.forEach(interceptor => {
      interceptor(request, this.next.bind(this));
    });
    return request;
  }

  afterResponse(response: Observable<Response>): Observable<Response> {

    // 创建一个subject对象，用于将普通的Observable对象转换成可多路推送消息的observal对象
    const subject = new Subject<Response>();
    const multicasted = response.timeout(this._timeOut).multicast(subject).refCount()
      .catch(err => {
        console.log(err);
        const responseOptionsArgs: ResponseOptionsArgs = {};

        // 根据错误名称响应不同的状态码和错误信息
        switch (err.name) {
          case 'TimeoutError':
            responseOptionsArgs.body = {
              statusCode: this.errorStatusCode,
              msg: '系统超时，请重试。'
            };
            break;
          default:
          // return Observable.throw(err);
        }

        if (window.navigator.onLine === false) {
          responseOptionsArgs.body = {
            statusCode: this.errorStatusCode,
            msg: '请检查网络连接是否正常'
          };
        };

        // 创建一个Response对象并通过Promise.resolve()发射出去
        const responseOptions: ResponseOptions = new ResponseOptions(responseOptionsArgs);
        const res: Response = new Response(responseOptions);
        return Promise.resolve(res);
      });

    // 请求响应后的处理逻辑
    multicasted.subscribe(
      res => {
        this._responseInterceptors.forEach(responseInterceptor => {
          responseInterceptor(res);
        });
      },
      err => {
        console.log(err);
      }
    );

    // 过滤掉请求失败的响应，只返回状态为成功的响应，失败响应在拦截器中统一处理;
    return multicasted;
  }

  // 添加拦截器
  addInterceptor(interceptor: Interceptor) {
    this._interceptors.push(interceptor);
  }

  // 将next函数放入响应拦截器
  next(responseInterceptor: ResponseInterceptor): void {
    this._responseInterceptors.push(responseInterceptor);
  };

  // 设置超时时长
  setTimeOut(timespan: number) {
    this._timeOut = timespan;
  }

}
