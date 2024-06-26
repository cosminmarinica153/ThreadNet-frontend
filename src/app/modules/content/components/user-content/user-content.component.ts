import { Component, OnInit, Signal, inject, signal } from '@angular/core';
import { ICategory } from '@apiModel/ICategory';
import { IThread } from '@apiModel/IThread';
import { IUser } from '@apiModel/IUser';
import { AuthentificationService } from 'app/modules/auth/authentification.service';
import { Observable, of, tap } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { ThreadService } from '../../services/thread.service';
import { UserService } from 'app/modules/info/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-content',
  templateUrl: './user-content.component.html',
  styleUrls: ['./user-content.component.css']
})
export class UserContentComponent implements OnInit {
  categories: Observable<ICategory[] | null> = of(null);
  popular: Observable<ICategory[] | null> = of(null);
  threads!: Signal<IThread[]>;
  title: string = '';

  user!: IUser | null;

  constructor(private categoryService: CategoryService, private authService: AuthentificationService, private router: Router) {
    this.user = this.authService.getUser();
    if(this.user == null) return;

    if(decodeURIComponent(this.router.url).includes('My Threads')){
      this.title = "My Threads";
      this.threads = inject(UserService).getThreadsSignal(this.user.id);
    }
    else if(decodeURIComponent(this.router.url).includes('Favourite Threads')){
      this.title = "Favourite Threads";
      this.threads = inject(UserService).getFavouriteThreadsSignal(this.user.id);
    }
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

}
