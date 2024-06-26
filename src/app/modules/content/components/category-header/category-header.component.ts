import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ICategory } from '@apiModel/ICategory';
import { UserInteractions } from '@apiModel/interactions/UserInteractions';
import { AuthentificationService } from 'app/modules/auth/authentification.service';
import { InteractionService } from '../../services/interaction.service';

@Component({
  selector: 'app-category-header',
  templateUrl: './category-header.component.html',
  styleUrls: ['./category-header.component.css']
})
export class CategoryHeaderComponent implements OnInit {
  @Input() category: ICategory = { id: 14, name: 'Other'} ;
  @Input() categories: ICategory[] | null= [];
  @Input() title: string = 'Home';
  choice: string = '';

  @Output() search = new EventEmitter<any>();

  userInteractions: UserInteractions | null;

  constructor(private authService: AuthentificationService, private router: Router, private interactionService: InteractionService) {
    this.userInteractions = this.interactionService.getUserInteractions();
  }

  ngOnInit() {
    this.categories?.push({ id: 14, name: 'Other'});
  }

  handleChoice(event: any){
    if(this.authService.getUser() == null){
      this.router.navigate(['/login']);
      return;
    }

    this.choice = event['data'];
  }

  isFavourite(): boolean{
    if(this.userInteractions == null)
      return false;

    if(this.userInteractions.favouriteCategories.find(id => id == this.category.id))
      return true;

    return false;
  }

  emitSearch(event: any){
    this.search.emit({text: event['text']});
  }

  handleVoteEmit(event: any){
    const data = event['data'];

    console.log(data);

    if(this.userInteractions == null)
      return;

    if(data.action == '+'){
      if(data.target == 'favouriteCategory'){
        this.userInteractions?.favouriteCategories.push(data.contentId);
      }
    }
    if(data.action == '-'){
      if(data.target == 'favouriteCategory'){
        this.userInteractions?.favouriteCategories.splice(this.userInteractions?.favouriteCategories.indexOf(data.contentId), 1);
      }
    }

    this.interactionService.updateUserInteractions(this.userInteractions);
  }

}
