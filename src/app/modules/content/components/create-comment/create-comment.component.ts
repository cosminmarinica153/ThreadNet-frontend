import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateCommentDto } from '@dto/CreateCommentDto';
import { CommentService } from '../../services/comment.service';
import { IUser } from '@apiModel/IUser';
import { AuthentificationService } from 'app/modules/auth/authentification.service';
import { IComment } from '@apiModel/IComment';
import { InteractionService } from '../../services/interaction.service';

@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.css']
})
export class CreateCommentComponent implements OnInit {
@Output() createComment = new EventEmitter<any>();

  submit: boolean = false;
  commentForm!: FormGroup;
  comment!: CreateCommentDto;

  userId: number = 0;
@Input() threadId: number = 0;

  get content(){
    return this.commentForm.get('content') as FormControl;
  }

  constructor(private fb: FormBuilder, private commentService: CommentService,
              private authService: AuthentificationService, private interactionService: InteractionService) { }

  ngOnInit() {
    var user = this.authService.getUser();
    if(user != null)
      this.userId = user.id;

    this.createCommentForm();
  }

  createCommentForm(){
    this.commentForm = this.fb.group({
      content: [null, [Validators.required]]
    })
  }

  onCreateComment(){
    this.submit = true;

    if(!this.commentForm.valid){
      this.commentForm.reset();
      return;
    }

    this.commentService.postComment(this.commentData()).subscribe({
      next: createdComment =>{
        var createdContent = this.interactionService.getUserCreatedContent();
        if(createdContent == null)
          return;

        createdContent.comments.push(createdComment.id);
        this.interactionService.updateUserCreatedContent(createdContent);

        this.createComment.emit({data: {status: 'success', comment: createdComment}});
      }
    });

  }

  commentData(): CreateCommentDto{
    return this.comment = {
      userId: this.userId,
      threadId: this.threadId,
      content: this.content.value,
      uploadDate: new Date(),
      isEdited: 0
    }
  }

  cancelCreate(){
    this.createComment.emit({data: {status: 'cancel'}});
  }
}
