import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateCategoryDto } from '@dto/CreateCategoryDto';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {
@Output() close = new EventEmitter<any>();

  submit: boolean = false;
  categoryForm!: FormGroup;
  category!: CreateCategoryDto;

  get categoryTitle(){
    return this.categoryForm.get('categoryTitle') as FormControl;
  }

  constructor(private fb: FormBuilder, private categoryService: CategoryService, private router: Router) { }

  ngOnInit() {
    this.createCategoryForm();
  }

  createCategoryForm(){
    this.categoryForm = this.fb.group({
      categoryTitle: [null, [Validators.required]]
    })
  }

  onCreateCategory(){
    this.submit = true;

    if(!this.categoryForm.valid){
      this.categoryForm.reset();
      return;
    }

    this.categoryService.postCategory(this.categoryData()).subscribe({
      next: category => {
        this.submit = false;

        if(category != null){
          this.closeModal();

          this.router.navigate(['category', category.name], { state: { categoryData: category } }).then(() => {
            window.location.reload();
          });
        }
      },
      error: error => {
        if (error.message === 'Name not unique'){
          this.categoryForm.setErrors({ notUnique: true })
        }
        return;
      }
    });

  }

  categoryData(): CreateCategoryDto{
    return this.category = {
      name: this.categoryTitle.value
    }
  }

  closeModal(){
    this.close.emit({data: ''});
  }

}
