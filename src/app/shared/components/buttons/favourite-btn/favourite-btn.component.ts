import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FavouriteCategory } from '@apiModel/FavouriteCategory';
import { FavouriteThread } from '@apiModel/FavouriteThread';
import { AuthentificationService } from 'app/modules/auth/authentification.service';
import { InteractionService } from 'app/modules/content/services/interaction.service';

@Component({
  selector: 'app-favourite-btn',
  templateUrl: './favourite-btn.component.html',
  styleUrls: ['./favourite-btn.component.css']
})
export class FavouriteBtnComponent implements OnInit {
  hover = false;
@Input() condition: boolean = false; // This is your condition. Set it based on your logic.
@Input() voteData!: { contentType: string, contentId: number };
@Output() voteEmit = new EventEmitter<any>();

  userId!: number;

  favouriteCategory!: FavouriteCategory;
  favouriteThread!: FavouriteThread;

  constructor(private interactionService: InteractionService, private authService: AuthentificationService, private router: Router) { }

  ngOnInit() {
    var user = this.authService.getUser();

    if(user == null) return;

    this.userId = user.id;
  }

  favouriteContent(){
    var userInteractions = this.interactionService.getUserInteractions();

    if(userInteractions == null){
      this.router.navigate(['login']);
      return;
    }

    console.log(this.voteData)

    switch(this.voteData.contentType){
      case 'category':
        if(userInteractions.favouriteCategories.find(categoryId => categoryId === this.voteData.contentId)){
          this.interactionService.deleteFavouriteCategory(this.favouriteCategoryData());
          this.emitAction('-', 'favouriteCategory');

          return;
        }
        this.interactionService.createFavouriteCategory(this.favouriteCategoryData());
        this.emitAction('+', 'favouriteCategory');

        break;
      case 'thread':
        if(userInteractions.favouriteThreads.find(threadId => threadId === this.voteData.contentId)){
          this.interactionService.deleteFavouriteThread(this.favouriteThreadData());
          this.emitAction('-', 'favouriteThread');

          return;
        }

        this.interactionService.createFavouriteThread(this.favouriteThreadData());
        this.emitAction('+', 'favouriteThread');

        break;
    }
  }

  emitAction(action: string, target: string){
    this.voteEmit.emit({data: {
      contentType: this.voteData.contentType,
      contentId: this.voteData.contentId,
      target: target,
      action: action,
    }});
  }

  favouriteCategoryData(): FavouriteCategory{
    return this.favouriteCategory = {
      userId: this.userId,
      categoryId: this.voteData.contentId
    }
  }

  favouriteThreadData(): FavouriteThread{
    return this.favouriteThread = {
      userId: this.userId,
      threadId: this.voteData.contentId
    }
  }

}
