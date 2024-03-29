import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ContentRoutingModule } from './content-routing.module';

import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { HomeComponent } from './components/home/home.component';
import { ThreadComponent } from './components/thread/thread.component';
import { ThreadListComponent } from './components/thread-list/thread-list.component';
import { CategoryHeaderComponent } from './components/category-header/category-header.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryPageComponent } from './components/category-page/category-page.component';
import { CreateThreadComponent } from './components/create-thread/create-thread.component';
import { CreateCategoryComponent } from './components/create-category/create-category.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ThreadPageComponent } from './components/thread-page/thread-page.component';
import { CreateCommentComponent } from './components/create-comment/create-comment.component';
import { CreateReplyComponent } from './components/create-reply/create-reply.component';
import { CommentComponent } from './components/comment/comment.component';
import { CommentReplyComponent } from './components/comment-reply/comment-reply.component';
import { UserCommentComponent } from './components/user-comment/user-comment.component';
import { UserContentComponent } from './components/user-content/user-content.component';
import { SearchPipe } from './pipes/search.pipe';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,

    ContentRoutingModule,
    SharedModule,
  ],
  declarations: [
    HomeComponent,
    CategoryPageComponent,
    UserContentComponent,

    ThreadComponent,
    CommentComponent,
    CommentReplyComponent,
    UserCommentComponent,

    ThreadListComponent,
    CategoryHeaderComponent,
    CategoryListComponent,
    ThreadPageComponent,

    CreateThreadComponent,
    CreateCategoryComponent,
    CreateCommentComponent,
    CreateReplyComponent,

    SearchPipe
  ],
  exports: [
    ThreadComponent,
    CommentComponent,
    CommentReplyComponent,
    UserCommentComponent,
  ]
})
export class ContentModule { }
