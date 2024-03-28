import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoRoutingModule } from './info-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { AccountComponent } from './components/account/account.component';
import { ContentModule } from '../content/content.module';

@NgModule({
  imports: [
    CommonModule,
    InfoRoutingModule,
    SharedModule,
    ContentModule
  ],
  declarations: [
    AboutComponent,
    ContactComponent,
    AccountComponent,
  ]
})
export class InfoModule { }
