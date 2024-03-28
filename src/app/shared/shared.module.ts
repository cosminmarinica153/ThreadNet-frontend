import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SubmitBtnComponent } from './components/buttons/submit-btn/submit-btn.component';
import { CancelBtnComponent } from './components/buttons/cancel-btn/cancel-btn.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { RouterModule } from '@angular/router';
import { UpVoteBtnComponent } from './components/buttons/up-vote-btn/up-vote-btn.component';
import { DownVoteBtnComponent } from './components/buttons/down-vote-btn/down-vote-btn.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { CreateBtnComponent } from './components/buttons/create-btn/create-btn.component';
import { FavouriteBtnComponent } from './components/buttons/favourite-btn/favourite-btn.component';
import { UpdateBtnComponent } from './components/buttons/update-btn/update-btn.component';
import { DeleteBtnComponent } from './components/buttons/delete-btn/delete-btn.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  declarations: [
    CreateBtnComponent,
    UpdateBtnComponent,
    DeleteBtnComponent,
    SubmitBtnComponent,
    CancelBtnComponent,

    UpVoteBtnComponent,
    DownVoteBtnComponent,
    FavouriteBtnComponent,

    DropdownComponent,

    SearchBarComponent,
  ],
  exports: [
    CreateBtnComponent,
    UpdateBtnComponent,
    DeleteBtnComponent,
    SubmitBtnComponent,
    CancelBtnComponent,
    UpVoteBtnComponent,
    DownVoteBtnComponent,
    FavouriteBtnComponent,
    DropdownComponent,
    SearchBarComponent,
  ]
})
export class SharedModule { }
