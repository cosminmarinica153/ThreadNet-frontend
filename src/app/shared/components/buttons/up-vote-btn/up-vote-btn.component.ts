import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CreateVoteDto } from '@dto/CreateVoteDto';
import { DeleteVoteDto } from '@dto/DeleteVoteDto';
import { AuthentificationService } from 'app/modules/auth/authentification.service';
import { InteractionService } from 'app/modules/content/services/interaction.service';

@Component({
  selector: 'app-up-vote-btn',
  templateUrl: './up-vote-btn.component.html',
  styleUrls: ['./up-vote-btn.component.css']
})
export class UpVoteBtnComponent implements OnInit {
  hover = false;
@Input() condition: boolean = false; // This is your condition. Set it based on your logic.
@Input() voteData!: { contentType: string, contentId: number };
@Output() voteEmit = new EventEmitter<any>();

  userId!: number;

  createVote!: CreateVoteDto;
  updateVote!: CreateVoteDto;
  deleteVote!: DeleteVoteDto;

  constructor(private interactionService: InteractionService, private authService: AuthentificationService, private router: Router) { }

  ngOnInit() {
    var user = this.authService.getUser();

    if(user == null) return;

    this.userId = user.id;
  }

  upVoteContent(){
    var userInteractions = this.interactionService.getUserInteractions();

    console.log(this.voteData);

    if(userInteractions == null){
      this.router.navigate(['login']);
      return;
    }

    switch(this.voteData.contentType){
      case 'thread':
        if(userInteractions.upVotedThreads.find(threadId => threadId === this.voteData.contentId)){
          this.interactionService.deleteVoteThread(this.deleteVoteData());

          this.emitAction('-', 'upVote');

          return; // Proceed to delete the up vote
        }

        if(userInteractions.downVotedThreads.find(threadId => threadId === this.voteData.contentId)){
          this.interactionService.updateVoteThread(this.updateVoteData());

          this.emitAction('+', 'upVote');
          this.emitAction('-', 'downVote');

          return; // Proceed to delete the down vote and create the up vote
        }

        this.interactionService.createVoteThread(this.createVoteData());
        this.emitAction('+', 'upVote');

        break;
      case 'comment':
        if(userInteractions.upVotedComments.find(commentId => commentId === this.voteData.contentId)){
          this.interactionService.deleteVoteComment(this.deleteVoteData());

          this.emitAction('-', 'upVote');

          return; // Proceed to delete the up vote
        }

        if(userInteractions.downVotedComments.find(commentId => commentId === this.voteData.contentId)){
          this.interactionService.updateVoteComment(this.updateVoteData());

          this.emitAction('+', 'upVote');
          this.emitAction('-', 'downVote');

          return; // Proceed to delete the down vote and create the up vote
        }

        this.interactionService.createVoteComment(this.createVoteData());
        this.emitAction('+', 'upVote');

        break;
      case 'reply':
        if(userInteractions.upVotedReplies.find(replyId => replyId === this.voteData.contentId)){
          this.interactionService.deleteVoteReply(this.deleteVoteData());

          this.emitAction('-', 'upVote');

          return; // Proceed to delete the up vote
        }

        if(userInteractions.downVotedReplies.find(replyId => replyId === this.voteData.contentId)){
          this.interactionService.updateVoteReply(this.updateVoteData());

          this.emitAction('+', 'upVote');
          this.emitAction('-', 'downVote');

          return; // Proceed to delete the down vote and create the up vote
        }

        this.interactionService.createVoteReply(this.createVoteData());
        this.emitAction('+', 'upVote');

        break;
    }

  }

  emitAction(action: string, target: string){
    this.voteEmit.emit({data: {
      contentType: this.voteData.contentType,
      contentId: this.voteData.contentId,
      action: action,
      target: target
    }});

  }

  createVoteData(): CreateVoteDto{
    return this.createVote = {
      userId: this.userId,
      contentId: this.voteData.contentId,
      voteType: 'upVote'
    }
  }

  updateVoteData(): CreateVoteDto{
    return this.updateVote = {
      userId: this.userId,
      contentId: this.voteData.contentId,
      voteType: 'upVote'
    }
  }

  deleteVoteData(): DeleteVoteDto{
    return this.deleteVote = {
      userId: this.userId,
      contentId: this.voteData.contentId
    }
  }


}
