import { EntranceRoutingModule } from './entrance-component/entrance-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntranceComponent } from './entrance-component/entrance.component';

@NgModule({
  imports: [
    CommonModule,
    EntranceRoutingModule
  ],
  declarations: [EntranceComponent]
})
export class EntranceModule { }
