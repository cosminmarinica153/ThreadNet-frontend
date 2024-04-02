import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IComment } from '@apiModel/IComment';
import { UserComment } from '@apiModel/UserComment';
import { UserCreatedContent } from '@apiModel/interactions/UserCreatedContent';
import { UserInteractions } from '@apiModel/interactions/UserInteractions';
import { UpdateCommentDto } from '@dto/UpdateCommentDto';
import { AuthentificationService } from 'app/modules/auth/authentification.service';
import { CommentService } from 'app/modules/content/services/comment.service';
import { InteractionService } from 'app/modules/content/services/interaction.service';
import { UserService } from 'app/modules/info/user.service';
import { ThreadService } from '../../services/thread.service';

@Component({
  selector: 'app-user-comment',
  templateUrl: './user-comment.component.html',
  styleUrls: ['./user-comment.component.css']
})
export class UserCommentComponent implements OnInit {
@Input() comment!: UserComment;
@Input() username: string = '';
@Output() deleteCommentEmit = new EventEmitter<any>();

  userInteractions: UserInteractions | null;
  userCreatedContent: UserCreatedContent | null;

  submit: boolean = false;
  isEditing: boolean = false;
  isConfirmModalOpen: boolean = false;

  updateForm!: FormGroup;
  updateCommentData!: UpdateCommentDto;

  get content(){
    return this.updateForm.get('content') as FormControl;
  }

  constructor(private router: Router, private interactionService: InteractionService, private fb: FormBuilder, private threadService: ThreadService,
              private userService: UserService, private authService: AuthentificationService, private commentService: CommentService) {
    this.userInteractions = this.interactionService.getUserInteractions();
    this.userCreatedContent = this.interactionService.getUserCreatedContent();
  }

  navigateToThread(){
    this.threadService.getOne(this.comment.threadId).subscribe({
      next: thread => {
        this.router.navigate(['thread', thread.id, thread.title]);
      }
    })
  }

  ngOnInit() {
    this.createUpdateForm();
  }

  createUpdateForm(){
    this.updateForm = this.fb.group({
      content: [this.comment.content, [Validators.required]]
    })
  }

  onUpdateComment(){
    this.submit = true;

    if(!this.updateForm.valid)
      return;

    if(this.comment.type == 'comment')
      this.commentService.updateComment(this.updateData()).subscribe({
        next: () => {
          this.comment.content = this.content.value;
          this.submit = false;
          this.toggleEditing();
        }
      });
    if(this.comment.type == 'reply')
      this.commentService.updateCommentReply(this.updateData()).subscribe({
        next: () => {
          this.comment.content = this.content.value;
          this.submit = false;
          this.toggleEditing();
        }
      });
  }

  updateData(): UpdateCommentDto{
    return this.updateCommentData = {
      id: this.comment.id,
      content: this.content.value
    }
  }

  deleteComment(){
    if(this.comment.type == 'comment')
      this.commentService.deleteComment(this.comment.id).subscribe({
        next: () => {
          this.deleteCommentEmit.emit({data: {comment: this.comment}});
          this.toggleConfirmModal();
        }
      })
    if(this.comment.type == 'reply')
      this.commentService.deleteCommentReply(this.comment.id).subscribe({
        next: () => {
          this.deleteCommentEmit.emit({data: {comment: this.comment}});
          this.toggleConfirmModal();
        }
      })
  }

  isUserComment(): boolean{
    if(this.userCreatedContent == null)
    return false;

    if(this.userCreatedContent.comments.find(id => id == this.comment.id))
      return true;

    return false;
  }

  toggleEditing(){
    this.isEditing = !this.isEditing;
  }
  toggleConfirmModal(){
    this.isConfirmModalOpen = !this.isConfirmModalOpen;
  }

  isUpVoted(): boolean{
    if(this.userInteractions == null)
      return false;

    if(this.userInteractions.upVotedComments.find(id => id == this.comment.id))
      return true;

    return false;
  }

  isDownVoted(): boolean{
    if(this.userInteractions == null)
      return false;

    if(this.userInteractions.downVotedComments.find(id => id == this.comment.id))
      return true;

    return false;
  }

  handleVoteEmit(event: any){
    const data = event['data'];

    if(this.comment.interactions == undefined)
        return;

    if(data.action == '+'){
      if(data.target == 'upVote'){
        this.comment.interactions.upVotes++;
        this.userInteractions?.upVotedComments.push(data.contentId);
      }
      if(data.target == 'downVote'){
        this.comment.interactions.downVotes++;
        this.userInteractions?.downVotedComments.push(data.contentId);
      }
    }
    if(data.action == '-'){
      if(data.target == 'upVote'){
        this.comment.interactions.upVotes--;
        this.userInteractions?.upVotedComments.splice(this.userInteractions?.upVotedThreads.indexOf(data.contentId), 1);
      }
      if(data.target == 'downVote'){
        this.comment.interactions.downVotes--;
        this.userInteractions?.downVotedComments.splice(this.userInteractions?.downVotedThreads.indexOf(data.contentId), 1);
      }
    }
    if(this.userInteractions == null) return;
    this.interactionService.updateUserInteractions(this.userInteractions);
  }

}
