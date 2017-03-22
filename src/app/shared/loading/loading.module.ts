import { LoadingService } from './loading.service';
import { LoadingComponent } from './loading.component';
import { NgModule } from '@angular/core';


@NgModule({
  declarations: [ LoadingComponent ],
  exports: [ LoadingComponent ],
  providers: [
    LoadingService
  ]
})
export class LoadingModule {

}
