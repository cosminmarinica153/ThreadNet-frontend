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
  }

  navigateToCategory(category: ICategory){
    this.router.navigate(['category', category.name], { state: { categoryData: category } })
  }

}
