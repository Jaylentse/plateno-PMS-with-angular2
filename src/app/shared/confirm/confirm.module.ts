import { ConfirmService } from './confirm.service/confirm.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm.component/confirm.component';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [ ConfirmService ]
})
export class ConfirmModule { }
