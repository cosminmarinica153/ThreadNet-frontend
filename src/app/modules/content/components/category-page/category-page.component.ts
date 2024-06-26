import { Component, Input, OnInit, Signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICategory } from '@apiModel/ICategory';
import { IThread } from '@apiModel/IThread';
import { Observable, map, of, tap } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { InteractionService } from '../../services/interaction.service';
import { UserInteractions } from '@apiModel/interactions/UserInteractions';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent implements OnInit {
  categories: Observable<ICategory[] | null> = of(null);
  popular: Observable<ICategory[] | null> = of(null);
  threads: Observable<IThread[] | null> = of(null);

  category!: ICategory;
@Input()  title: string = '';
  searchText: string = '';

  userInteractions: UserInteractions | null;

  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  constructor(private categoryService: CategoryService, private interactionService: InteractionService) {
    this.route.params.subscribe(params => {
      this.title = params['categoryName'];
    });

    this.categoryService.getByName(this.title).subscribe({
      next: category => {
        this.category = category;

        this.categoryService.getThreads(category.id).subscribe({
          next: data => this.threads = of(data)
        })
      }
    })

    this.userInteractions = interactionService.getUserInteractions();
  }

  ngOnInit() {
    this.categoryService.getAll().subscribe({
      next: data => {
        var other = data.find(c => c.name == 'Other');
        if(other != null)
          data.splice(data.indexOf(other), 1);

        this.categories = of(data)
      }
    })

    this.categoryService.getPopular(5).subscribe({
      next: data => {
        var other = data.find(c => c.name == 'Other');
        if(other != null)
          data.splice(data.indexOf(other), 1);

        this.popular = of(data)
      }
    })
  }

  setSearch(event: any){
    this.searchText = event['text'];
  }

}
