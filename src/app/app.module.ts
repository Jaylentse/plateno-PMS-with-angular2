import { SharedModule } from './shared/shared.module';
import { EntranceModule } from './entrance/entrance.module';
import { LoginComponent } from './login/login-component/login.component';
import { LoginModule } from './login/login.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SharedModule,
    AppRoutingModule,
    LoginModule,
    EntranceModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
