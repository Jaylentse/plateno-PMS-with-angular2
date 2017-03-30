import { async } from 'rxjs/scheduler/async';
import { ConfirmService, Confirm } from './../confirm.service/confirm.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: [ './confirm.component.scss' ]
})
export class ConfirmComponent implements OnInit {

  confirmList: Array<Confirm> = [];

  constructor(
    private confirmService: ConfirmService
  ) { }

  ngOnInit() {
    this.confirmService.confirmListener.subscribe((confirm: Confirm) => {
      this.confirmList.push(confirm);
    });
  }

  close() {
    this.confirmList[ 0 ].feedback.emit(false);
    async.schedule(() => this.confirmList.shift());
  }

}
