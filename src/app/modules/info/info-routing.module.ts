import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './components/about/about.component';
import { AccountComponent } from './components/account/account.component';

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'user/:userId/:username', component: AccountComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoRoutingModule { }
