import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CreateVoteDto } from '@dto/CreateVoteDto';
import { DeleteVoteDto } from '@dto/DeleteVoteDto';
import { AuthentificationService } from 'app/modules/auth/authentification.service';
import { InteractionService } from 'app/modules/content/services/interaction.service';

@Component({
  selector: 'app-down-vote-btn',
  templateUrl: './down-vote-btn.component.html',
  styleUrls: ['./down-vote-btn.component.css']
})
export class DownVoteBtnComponent implements OnInit {
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

  downVoteContent(){
    var userInteractions = this.interactionService.getUserInteractions();

    if(userInteractions == null){
      this.router.navigate(['login']);
      return;
    }

    console.log(this.voteData)

    switch(this.voteData.contentType){
      case 'thread':
        if(userInteractions.downVotedThreads.find(threadId => threadId === this.voteData.contentId)){
          this.interactionService.deleteVoteThread(this.deleteVoteData());

          this.emitAction('-', 'downVote');

          console.log('emit decrease downvote')

          return; // Proceed to delete the up vote
        }

        if(userInteractions.upVotedThreads.find(threadId => threadId === this.voteData.contentId)){
          this.interactionService.updateVoteThread(this.updateVoteData());

          this.emitAction('+', 'downVote');
          this.emitAction('-', 'upVote');

          console.log('emit update vote')


          return; // Proceed to delete the down vote and create the up vote
        }

        this.interactionService.createVoteThread(this.createVoteData());
        this.emitAction('+', 'downVote');
          console.log('emit increase downvote')


        break;
      case 'comment':
        console.log('Case comment');
        if(userInteractions.downVotedComments.find(commentId => commentId === this.voteData.contentId)){
          this.interactionService.deleteVoteComment(this.deleteVoteData());

          this.emitAction('-', 'downVote');

          return; // Proceed to delete the up vote
        }

        if(userInteractions.upVotedComments.find(commentId => commentId === this.voteData.contentId)){
          this.interactionService.updateVoteComment(this.updateVoteData());

          this.emitAction('+', 'downVote');
          this.emitAction('-', 'upVote');

          return; // Proceed to delete the down vote and create the up vote
        }

        this.interactionService.createVoteComment(this.createVoteData());
        this.emitAction('+', 'downVote');

        break;
      case 'reply':
        if(userInteractions.downVotedReplies.find(replyId => replyId === this.voteData.contentId)){
          this.interactionService.deleteVoteReply(this.deleteVoteData());

          this.emitAction('-', 'downVote');

          return; // Proceed to delete the up vote
        }

        if(userInteractions.upVotedReplies.find(replyId => replyId === this.voteData.contentId)){
          this.interactionService.updateVoteReply(this.updateVoteData());

          this.emitAction('+', 'downVote');
          this.emitAction('-', 'upVote');

          return; // Proceed to delete the down vote and create the up vote
        }

        this.interactionService.createVoteReply(this.createVoteData());
        this.emitAction('+', 'downVote');

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
      voteType: 'downVote'
    }
  }

  updateVoteData(): CreateVoteDto{
    return this.updateVote = {
      userId: this.userId,
      contentId: this.voteData.contentId,
      voteType: 'downVote'
    }
  }

  deleteVoteData(): DeleteVoteDto{
    return this.deleteVote = {
      userId: this.userId,
      contentId: this.voteData.contentId
    }
  }

}
