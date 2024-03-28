import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';

import { AuthModule } from './modules/auth/auth.module';
import { ContentModule } from './modules/content/content.module';
import { InfoModule } from './modules/info/info.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,

    CoreModule,

    // Features
    AuthModule,
    ContentModule,
    InfoModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
