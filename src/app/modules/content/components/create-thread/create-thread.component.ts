import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ICategory } from '@apiModel/ICategory';
import { CreateThreadDto } from '@dto/CreateThreadDto';
import { AuthentificationService } from 'app/modules/auth/authentification.service';
import { ThreadService } from '../../services/thread.service';
import { UserCreatedContent } from '@apiModel/interactions/UserCreatedContent';
import { InteractionService } from '../../services/interaction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-thread',
  templateUrl: './create-thread.component.html',
  styleUrls: ['./create-thread.component.css']
})
export class CreateThreadComponent implements OnInit {
@Input() categoryOptions: ICategory[] | null = [];
@Output() close = new EventEmitter<any>();
@Input() preset: ICategory = { id: 2, name: 'Other'};

  submit: boolean = false;
  threadForm!: FormGroup;
  thread!: CreateThreadDto;
  userId: number = 0;

  userCreatedContent: UserCreatedContent | null;

  get category(){
    return this.threadForm.get('category') as FormControl;
  }
  get threadTitle(){
    return this.threadForm.get('threadTitle') as FormControl;
  }
  get content(){
    return this.threadForm.get('content') as FormControl;
  }

  constructor(private fb: FormBuilder, private authService: AuthentificationService, private threadService: ThreadService,
              private interactionService: InteractionService, private router: Router) {
    this.userCreatedContent = this.interactionService.getUserCreatedContent();
  }

  ngOnInit() {
    if(window.history.state.categoryData)
      this.preset = window.history.state.categoryData;

    let user = this.authService.getUser();
    if(user)
      this.userId = user.id;

    console.log(this.preset);
    this.createForm();
  }

  createForm(){
    this.threadForm = this.fb.group({
        category: [this.preset.id, []],
        threadTitle: [null, [Validators.required]],
        content: [null, [Validators.required]]
    });
  }

  onCreateThread(){
    this.submit = true;

    if(!this.threadForm.valid){
      this.threadForm.reset();
      this.threadForm.setValue({
        category: this.preset.id,
        threadTitle: null,
        content: null
      });
      return;
    }

    this.threadService.postThread(this.threadData()).subscribe({
      next: thread => {
        if(this.userCreatedContent != null){
          this.userCreatedContent.threads.push(thread.id);
          this.interactionService.updateUserCreatedContent(this.userCreatedContent);
        }

        this.router.navigate(['thread', thread.title], { state: { threadData: thread } })
      }
    });
  }

  threadData(): CreateThreadDto{
    return this.thread = {
      userId: this.userId,
      categoryId: this.category.value,
      title: this.threadTitle.value,
      content: this.content.value,
      uploadDate: new Date(),
      isEdited: 0
    }
  }

  closeModal(){
    this.close.emit({data: ''});
  }

}
