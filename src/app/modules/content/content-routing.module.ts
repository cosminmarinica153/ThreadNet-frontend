import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
// import { HomeResolver } from './resolvers/home.resolver';
import { CategoryPageComponent } from './components/category-page/category-page.component';
import { ThreadPageComponent } from './components/thread-page/thread-page.component';
import { UserContentComponent } from './components/user-content/user-content.component';
// import { ThreadResolver } from './resolvers/thread.resolver';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'category/:categoryName',
    component: CategoryPageComponent,
  },
  {
    path: 'thread/:threadId/:threadTitle',
    component: ThreadPageComponent,
  },
  {
    path: 'user/Favourite Threads',
    component: UserContentComponent
  },
  {
    path: 'user/My Threads',
    component: UserContentComponent
  },
  { path: '', redirectTo:'/home', pathMatch:"full"},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }
