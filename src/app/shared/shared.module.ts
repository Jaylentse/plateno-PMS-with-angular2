import { LoadingComponent } from './loading/loading.component';
import { LoadingModule } from './loading/loading.module';
import { PMSHttpModule } from './pms-http/pms-http.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    PMSHttpModule,
    LoadingModule
  ],
  exports: [ LoadingModule ]
})
export class SharedModule { }
