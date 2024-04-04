import { Component, OnInit, Signal, inject } from '@angular/core';
import { Observable, finalize, map, of, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { ICategory } from '@apiModel/ICategory';
import { IThread } from '@apiModel/IThread';
import { IUser } from '@apiModel/IUser';
import { AuthentificationService } from 'app/modules/auth/authentification.service';
import { ThreadService } from '../../services/thread.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categories: Observable<ICategory[] | null> = of(null);
  popular: Observable<ICategory[] | null> = of(null);
  threads: Signal<IThread[]>;

  user!: IUser | null;

  searchText: string = '';

  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  constructor(private categoryService: CategoryService, private authService: AuthentificationService) {
    this.threads = inject(ThreadService).getAllSignal();
  }

  ngOnInit() {
    this.user = this.authService.getUser();

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
