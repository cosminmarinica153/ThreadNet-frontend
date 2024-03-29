import { Component, OnInit, Signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IComment } from '@apiModel/IComment';
import { IThread } from '@apiModel/IThread';
import { IUser } from '@apiModel/IUser';
import { Observable, tap } from 'rxjs';
import { AuthentificationService } from 'app/modules/auth/authentification.service';
import { UserInteractions } from '@apiModel/interactions/UserInteractions';
import { ThreadService } from '../../services/thread.service';
import { UserService } from 'app/modules/info/user.service';

@Component({
  selector: 'app-thread-page',
  templateUrl: './thread-page.component.html',
  styleUrls: ['./thread-page.component.css']
})
export class ThreadPageComponent implements OnInit {
  comments$: Observable<IComment[]>;

  threadData!: IThread;
  comments: IComment[] = [];
  discussionParticipants!: Signal<IUser[]>;

  userInteractions!: UserInteractions | null;

  isCreatingComment: Boolean = false;

  constructor(private router: Router, private threadService: ThreadService,
              private authService: AuthentificationService, private userService: UserService) {
      this.threadData = window.history.state.threadData;

      this.comments$ = this.threadService.getThreadComments(this.threadData.id).pipe(
        tap(comments => { return comments })
      );

      this.comments$.subscribe({
        next: comments => {
          this.comments = comments;
        }
      })

      this.discussionParticipants = inject(ThreadService).getDiscussionPartipantsSignal(this.threadData.id);
  }

  ngOnInit() {}

  navigateToUser(userId: number){
    this.userService.getUser(userId).subscribe({
      next: user => {
        this.router.navigate(['user', user.username], { state: { userData: user } })
      }
    })
  }

  toggleCreateComment(){
    if(this.authService.getUser() == null)
      this.router.navigate(['login']);

    this.isCreatingComment = !this.isCreatingComment;
  }

  handleCreateComment(event: any){
    const data = event['data'];

    if(data.status == 'cancel'){
      this.toggleCreateComment();
      return;
    }

    this.comments.push(data.comment);
    this.toggleCreateComment();
  }
  handleDeleteComment(event:any){
    const data = event['data'];

    this.comments.splice(this.comments.indexOf(data.comment), 1);
  }
}
