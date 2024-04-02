import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IComment } from '@apiModel/IComment';
import { UserCreatedContent } from '@apiModel/interactions/UserCreatedContent';
import { UserInteractions } from '@apiModel/interactions/UserInteractions';
import { InteractionService } from '../../services/interaction.service';
import { UserService } from 'app/modules/info/user.service';
import { AuthentificationService } from 'app/modules/auth/authentification.service';
import { UpdateCommentDto } from '@dto/UpdateCommentDto';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
@Input() comment!: IComment;
@Output() deleteCommentEmit = new EventEmitter<any>();

  userInteractions: UserInteractions | null;
  userCreatedContent: UserCreatedContent | null;

  isCreatingReply: boolean = false;

  submit: boolean = false;
  isEditing: boolean = false;
  isConfirmModalOpen: boolean = false;

  updateForm!: FormGroup;
  updateCommentData!: UpdateCommentDto;

  get content(){
    return this.updateForm.get('content') as FormControl;
  }

  constructor(private router: Router, private interactionService: InteractionService, private fb: FormBuilder,
              private userService: UserService, private authService: AuthentificationService, private commentService: CommentService) {
    this.userInteractions = this.interactionService.getUserInteractions();
    this.userCreatedContent = this.interactionService.getUserCreatedContent();
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
    console.log('update comment')
    this.submit = true;

    if(!this.updateForm.valid)
      return;

    this.commentService.updateComment(this.updateData()).subscribe({
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
    this.commentService.deleteComment(this.comment.id).subscribe({
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
    console.log('toggle');
    this.isEditing = !this.isEditing;
  }
  toggleConfirmModal(){
    this.isConfirmModalOpen = !this.isConfirmModalOpen;
  }

  toggleCreateReply(){
    if(this.authService.getUser() == null)
      this.router.navigate(['login']);

    this.isCreatingReply = !this.isCreatingReply;
  }

  navigateToUser(){
    this.userService.getUser(this.comment.user.id).subscribe({
      next: user => {
        this.router.navigate(['user', user.id, user.username])
      }
    })
  }

  handleCreateReply(event: any){
    const data = event['data'];

    if(data.status == 'cancel'){
      this.toggleCreateReply();
      return;
    }

    this.comment.replies.push(data.reply);
    this.toggleCreateReply();
  }
  handleDeleteReply(event:any){
    const data = event['data'];

    this.comment.replies.splice(this.comment.replies.indexOf(data.reply), 1);
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

    if(this.comment.commentInteractions == undefined)
        return;

    if(data.action == '+'){
      if(data.target == 'upVote'){
        this.comment.commentInteractions.upVotes++;
        this.userInteractions?.upVotedComments.push(data.contentId);
      }
      if(data.target == 'downVote'){
        this.comment.commentInteractions.downVotes++;
        this.userInteractions?.downVotedComments.push(data.contentId);
      }
    }
    if(data.action == '-'){
      if(data.target == 'upVote'){
        this.comment.commentInteractions.upVotes--;
        this.userInteractions?.upVotedComments.splice(this.userInteractions?.upVotedThreads.indexOf(data.contentId), 1);
      }
      if(data.target == 'downVote'){
        this.comment.commentInteractions.downVotes--;
        this.userInteractions?.downVotedComments.splice(this.userInteractions?.downVotedThreads.indexOf(data.contentId), 1);
      }
    }
    if(this.userInteractions == null) return;
    this.interactionService.updateUserInteractions(this.userInteractions);
  }

}
