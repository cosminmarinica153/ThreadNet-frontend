import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICategory } from '@apiModel/ICategory';
import { IUser } from '@apiModel/IUser';
import { AuthentificationService } from 'app/modules/auth/authentification.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
@Input() categories: ICategory[] | null = [];
@Input() popular: ICategory[] | null = [];
  user!: IUser | null;

  constructor(private router: Router, private authService: AuthentificationService) { }

  ngOnInit() {
    this.user = this.authService.getUser();

    // Make sure to remove Other category

    console.log(this.categories)

    var other = this.categories?.find(c => c.name == 'Other');
    if(other == null)
      return;

    this.categories?.splice(this.categories?.indexOf(other, 1));

    if(this.popular?.find(c => c == other))
      this.popular.splice(this.popular.indexOf(other, 1));
  }

  navigateToCategory(category: ICategory){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['category', category.name])
    })
  }

}
