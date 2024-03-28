import { Component, OnInit, Signal, inject } from '@angular/core';
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
  threads: Signal<IThread[]>;

  category: ICategory;
  title: string = '';

  userInteractions: UserInteractions | null;

  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  constructor(private categoryService: CategoryService, private interactionService: InteractionService) {
    this.category = window.history.state.categoryData;

    this.threads = inject(CategoryService).getThreadsSignal(this.category.id);

    this.userInteractions = interactionService.getUserInteractions();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.title = params['categoryName'];
    });

    this.categoryService.getAll().pipe(
      tap(data => this.categories = of(data))
    ).subscribe();

    this.categoryService.getPopular(5).pipe(
      tap(data => this.popular = of(data))
    ).subscribe();


  }


}
