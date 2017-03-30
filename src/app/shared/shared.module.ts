import { ConfirmComponent } from './confirm/confirm.component/confirm.component';
import { ConfirmModule } from './confirm/confirm.module';
import { LoadingComponent } from './loading/loading.component/loading.component';
import { LoadingModule } from './loading/loading.module';
import { PMSHttpModule } from './pms-http/pms-http.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from './popup/popup.component';

@NgModule({
  imports: [
    CommonModule,
    PMSHttpModule,
    LoadingModule,
    ConfirmModule
  ],
  exports: [ PopupComponent, ConfirmComponent, LoadingComponent ],
  declarations: [ PopupComponent, ConfirmComponent, LoadingComponent ]
})
export class SharedModule { }
