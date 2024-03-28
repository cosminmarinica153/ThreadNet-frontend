import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateReplyDto } from '@dto/CreateReplyDto';
import { CommentService } from '../../services/comment.service';
import { AuthentificationService } from 'app/modules/auth/authentification.service';
import { InteractionService } from '../../services/interaction.service';
import { UserCreatedContent } from '@apiModel/interactions/UserCreatedContent';

@Component({
  selector: 'app-create-reply',
  templateUrl: './create-reply.component.html',
  styleUrls: ['./create-reply.component.css']
})
export class CreateReplyComponent implements OnInit {
@Output() createReply = new EventEmitter<any>();

  submit: boolean = false;
  replyForm!: FormGroup;
  reply!: CreateReplyDto;

  userId: number = 0;
@Input() commentId: number = 0

  get content(){
    return this.replyForm.get('content') as FormControl;
  }

  constructor(private fb: FormBuilder, private commentService: CommentService,
              private authService: AuthentificationService, private interactionService: InteractionService) { }

  ngOnInit() {
    var user = this.authService.getUser();
    if(user != null)
      this.userId = user.id;

    this.createReplyForm();
  }

  createReplyForm(){
    this.replyForm = this.fb.group({
      content: [null, Validators.required]
    })
  }

  onCreateReply(){
    this.submit = true;

    if(!this.replyForm.valid){
      this.replyForm.reset();
      return;
    }

    this.commentService.postReply(this.replyData()).subscribe({
      next: createdReply =>{
        var createdContent = this.interactionService.getUserCreatedContent();
        if(createdContent == null)
          return;

        createdContent.commentReplies.push(createdReply.id);
        this.interactionService.updateUserCreatedContent(createdContent);

        this.createReply.emit({data: {status: 'succes', reply: createdReply}});
      }
    });

  }

  replyData(): CreateReplyDto{
    return this.reply = {
      userId: this.userId,
      commentId: this.commentId,
      content: this.content.value,
      uploadDate: new Date(),
      isEdited: 0
    }
  }

  cancelCreate(){
    this.createReply.emit({data: {status: 'cancel'}});
  }

}
