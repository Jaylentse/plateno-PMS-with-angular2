import { EntranceComponent } from './entrance.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';



@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'entrance', component: EntranceComponent }
    ])
  ],
  exports: [ RouterModule ]
})
export class EntranceRoutingModule { }
