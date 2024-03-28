import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ICommentReply } from '@apiModel/ICommentReply';
import { UserCreatedContent } from '@apiModel/interactions/UserCreatedContent';
import { UserInteractions } from '@apiModel/interactions/UserInteractions';
import { InteractionService } from '../../services/interaction.service';
import { UserService } from 'app/modules/info/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { UpdateCommentDto } from '@dto/UpdateCommentDto';

@Component({
  selector: 'app-comment-reply',
  templateUrl: './comment-reply.component.html',
  styleUrls: ['./comment-reply.component.css']
})
export class CommentReplyComponent implements OnInit {
@Input() reply!: ICommentReply;
@Output() deleteReplyEmit = new EventEmitter<any>();

  userInteractions: UserInteractions | null;
  userCreatedContent: UserCreatedContent | null;

  submit: boolean = false;
  isEditing: boolean = false;
  isConfirmModalOpen: boolean = false;

  updateForm!: FormGroup;
  updateReplyData!: UpdateCommentDto;

  get content(){
    return this.updateForm.get('content') as FormControl;
  }

  constructor(private router: Router, private interactionService: InteractionService, private userService: UserService,
              private fb: FormBuilder, private commentService: CommentService) {
    this.userInteractions = this.interactionService.getUserInteractions();
    this.userCreatedContent = this.interactionService.getUserCreatedContent();
  }

  ngOnInit() {
    this.createUpdateForm();
  }

  createUpdateForm(){
    this.updateForm = this.fb.group({
      content: [this.reply.content, [Validators.required]]
    })
  }

  onUpdateReply(){
    this.submit = true;

    if(!this.updateForm.valid)
      return;

    this.commentService.updateCommentReply(this.updateData()).subscribe({
      next: () => {
        this.reply.content = this.content.value;
        this.submit = false;
        this.toggleEditing();
      }
    });
  }

  updateData(): UpdateCommentDto{
    return this.updateReplyData = {
      id: this.reply.id,
      content: this.content.value
    }
  }

  deleteReply(){
    this.commentService.deleteCommentReply(this.reply.id).subscribe({
      next: () => {
        this.deleteReplyEmit.emit({data: {reply: this.reply}});
        this.toggleConfirmModal();
      }
    })
  }

  toggleEditing(){
    this.isEditing = !this.isEditing;
  }
  toggleConfirmModal(){
    this.isConfirmModalOpen = !this.isConfirmModalOpen;
  }

  navigateToUser(){
    this.userService.getUser(this.reply.user.id).subscribe({
      next: user => {
        this.router.navigate(['user', user.username], { state: { userData: user } })
      }
    })
  }

  isUserReply(): boolean{
    if(this.userCreatedContent == null)
    return false;

  if(this.userCreatedContent.commentReplies.find(id => id == this.reply.id))
      return true;

    return false;
  }

  isUpVoted(): boolean{
    if(this.userInteractions == null)
      return false;

    if(this.userInteractions.upVotedReplies.find(id => id == this.reply.id))
      return true;

    return false;
  }

  isDownVoted(): boolean{
    if(this.userInteractions == null)
      return false;

    if(this.userInteractions.downVotedReplies.find(id => id == this.reply.id))
      return true;

    return false;
  }

  handleVoteEmit(event: any){
    const data = event['data'];

    if(this.reply.commentReplyInteractions == undefined)
        return;

    if(data.action == '+'){
      if(data.target == 'upVote'){
        this.reply.commentReplyInteractions.upVotes++;
        this.userInteractions?.upVotedReplies.push(data.contentId);
      }
      if(data.target == 'downVote'){
        this.reply.commentReplyInteractions.downVotes++;
        this.userInteractions?.downVotedReplies.push(data.contentId);
      }
    }
    if(data.action == '-'){
      if(data.target == 'upVote'){
        this.reply.commentReplyInteractions.upVotes--;
        this.userInteractions?.upVotedReplies.splice(this.userInteractions?.upVotedThreads.indexOf(data.contentId), 1);
      }
      if(data.target == 'downVote'){
        this.reply.commentReplyInteractions.downVotes--;
        this.userInteractions?.downVotedReplies.splice(this.userInteractions?.downVotedThreads.indexOf(data.contentId), 1);
      }
    }
    if(this.userInteractions == null) return;
    this.interactionService.updateUserInteractions(this.userInteractions);
  }

}
