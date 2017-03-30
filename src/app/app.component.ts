import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Confirm, ConfirmService } from './shared/confirm/confirm.service/confirm.service';

import { AsyncSubject } from 'rxjs/Rx';
import { PmsHttp } from './shared/pms-http/pms-http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit, AfterViewInit {

  constructor(
    private http: PmsHttp,
    private confirmService: ConfirmService
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.http
      .confirm('活着不好吗', '好的', '不好')
      .confirm('江信江疑', '信', '疑', true)
      .confirm('test', '1', '2', false)
      .confirm('test12', true)
      .post('http://10.100.113.28:8080/pms-web/rest/param/getParamValueByID', {})
      .subscribe(res => {
        console.log(res);
      });

  }

}
