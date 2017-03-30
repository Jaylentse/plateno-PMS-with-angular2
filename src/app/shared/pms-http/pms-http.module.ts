import { LoadingService } from './../loading/loading.service/loading.service';
import { ConfirmService } from './../confirm/confirm.service/confirm.service';
import { HttpInterceptor } from './http-interceptor.service';
import { RequestOptions, XHRBackend } from '@angular/http';
import { HttpInterceptorBackend } from './http-interceptor-backend.service';
import { CommonModule } from '@angular/common';
import { httpFactory, PmsHttp } from './pms-http.service';
import { NgModule } from '@angular/core';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    HttpInterceptor,
    HttpInterceptorBackend,
    ConfirmService,
    {
      provide: PmsHttp,
      useFactory: httpFactory,
      deps: [
        HttpInterceptorBackend,
        RequestOptions,
        ConfirmService
      ]
    }
  ]
})
export class PMSHttpModule {

  constructor(
    private httpInterceptor: HttpInterceptor,
    private loading: LoadingService
  ) {

    // 统一添加拦截器
    // this.httpInterceptor.addInterceptor((request, next) => {
    //   console.log(request);
    //   next(res => {
    //     console.log(res);
    //   });
    // });

    // 1. 对loading统一处理
    this.httpInterceptor.addInterceptor((request, next) => {
      this.loading.beginLoading();
      console.log(request);
      next(res => {
        this.loading.finishLoading();
      });
    });

    // 2. 对抛错统一处理
    this.httpInterceptor.addInterceptor((request, next) => {
      next(res => {
        if (res.json().statusCode !== this.httpInterceptor.successStatusCode) {
          console.log(res.json());
        }
      });
    });
  }
}
