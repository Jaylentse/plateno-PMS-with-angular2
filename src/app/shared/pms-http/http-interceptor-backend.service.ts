import { HttpInterceptor } from './http-interceptor.service';
import { ConnectionBackend, Request, XHRBackend, XHRConnection } from '@angular/http';
import { Injectable } from '@angular/core';


/**
 * @description 实现ConnectionBackend抽象类，目的是封装XHRBackend服务
 *              在XHRBackend创建XHRConnection实例前后进行相应的处理
 *
 * @export {method} createConnection (request: Request) => XHRConnection
 * @class HttpInterceptorBackend
 * @implements {ConnectionBackend}
 * @author Jaylen-Tse <jaylen.tse@platenogroup.com>
 */
@Injectable()
export class HttpInterceptorBackend implements ConnectionBackend {

  constructor(
    private _httpInterCeptor: HttpInterceptor,
    private _xhrBackend: XHRBackend
  ) { }

  createConnection(request: Request): XHRConnection {
    const interceptor = this._httpInterCeptor;
    const req = interceptor.beforeRequest ? interceptor.beforeRequest(request) : request;
    const result = this._xhrBackend.createConnection(req);

    result.response = interceptor.afterResponse ? interceptor.afterResponse(result.response) : result.response;

    return result;
  }
}
