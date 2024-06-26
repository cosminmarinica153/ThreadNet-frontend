import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
  ],
  exports: [
  ]
})
export class AuthModule { }
