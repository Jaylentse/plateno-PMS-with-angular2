import { Component, OnInit } from '@angular/core';
import { Confirm, ConfirmService } from './shared/confirm/confirm.service';

import { AsyncSubject } from 'rxjs/Rx';
import { LoadingService } from './shared/loading/loading.service';
import { PmsHttp } from './shared/pms-http/pms-http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
  private loading = false;

  constructor(
    private http: PmsHttp,
    private loadingService: LoadingService,
    private confirmService: ConfirmService
  ) { }

  ngOnInit() {

    this.loadingService.loadingListener.subscribe(isLoading => {
      this.loading = isLoading;
    });

    this.confirmService.confirmListener.subscribe(confirm => {
      // console.log(confirm);

      const result = window.prompt(confirm.msg);
      if (result === 'ok') {
        confirm.feedback.emit(true);
      } else {
        confirm.feedback.emit(false);
      }

      // confirm.trigger.complete();
    });

    this.http
      .confirm('活着不好吗', '好的', '不好')
      .confirm('江信江疑', '信', '疑', true)
      .confirm('test', '1', '2', false)
      .confirm('test12', true)
      .post('http://10.100.113.28:8080/pms-web/rest/param/getParamValueByID', {})
      .subscribe(res => {
        console.log(res);
      });

    // this.http.post('http://10.100.113.28:8080/pms-web/rest/param/getParamValueByID', {}).subscribe(
    //   data => {
    //     console.log(data.json());
    //   },
    //   err => {
    //     console.log(err);
    //   },
    //   () => {
    //     console.log('complete');
    //   }
    // );
  }

}
