import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login-component/login.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ LoginComponent ],
  exports: [ LoginComponent ]
})
export class LoginModule { }
