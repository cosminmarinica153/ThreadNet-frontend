import { Component, OnInit } from '@angular/core';
import { IUser } from '@apiModel/IUser';
import { UserStats } from '@apiModel/interactions/UserStats';
import { UserService } from '../../user.service';
import { Observable } from 'rxjs';
import { IThread } from '@apiModel/IThread';
import { UserComment } from '@apiModel/UserComment';
import { UserInteractions } from '@apiModel/interactions/UserInteractions';
import { AuthentificationService } from 'app/modules/auth/authentification.service';
import { InteractionService } from 'app/modules/content/services/interaction.service';
import { Router } from '@angular/router';
import { ThreadService } from 'app/modules/content/services/thread.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  user: IUser;
  userStats!: UserStats;

  userInteractions: UserInteractions | null;

  followers: IUser[] = [];
  following: IUser[] = [];

  favouriteThreads: IThread[] = [];
  threads: IThread[] = [];
  comments: UserComment[] = [];

  constructor(private userService: UserService, private interactionService: InteractionService,
              private authService: AuthentificationService, private router: Router, private threadService: ThreadService) {
    this.user = window.history.state.userData;
    this.userInteractions = this.interactionService.getUserInteractions();
  }

  ngOnInit() {
    // this.userService.getUserStats(this.user.id).subscribe({
    //   next: stats => { this.userStats = stats; }
    // });

    this.userService.getFavouriteThreads(this.user.id).subscribe({
      next: threads => { this.favouriteThreads = threads }
    })

    this.userService.getUserThreads(this.user.id).subscribe({
      next: threads => { this.threads = threads; }
    })

    this.userService.getUserComments(this.user.id).subscribe({
      next: comments => { this.comments = comments }
    })

    // this.userService.getFollowers(this.user.id).subscribe({
    //   next: followers => { this.followers = followers }
    // })

    // this.userService.getFollowing(this.user.id).subscribe({
    //   next: following => { this.following = following }
    // })
  }

  isFollowerModalOpen: boolean = false;
  isFollowingModalOpen: boolean = false;

  toggleFollowerModal(){
    this.isFollowerModalOpen = !this.isFollowerModalOpen
  }
  toggleFollowingModal(){
    this.isFollowingModalOpen = !this.isFollowingModalOpen
  }

  isUserPage(): boolean{
    var loggedUser = this.authService.getUser();
    if(loggedUser == null)
      return false;

    if(loggedUser.id == this.user.id)
      return true;

    return false;
  }

  navigateToUser(user: IUser){
    if(this.isFollowerModalOpen) this.toggleFollowerModal();
    if(this.isFollowingModalOpen) this.toggleFollowingModal();

    this.router.navigate(['user', user.username], { state: { userData: user } }).then(() => location.reload())
  }

  isFollowing(): boolean{
    var loggedUser = this.authService.getUser();
    if(loggedUser == null)
      return false;

    if(this.userInteractions == null)
      return false;

    if(this.userInteractions.following.find(followingId => followingId == this.user.id))
      return true;

    return false;
  }

  handleFollow(){
    if(this.userInteractions == null)
    return;

    var loggedUser = this.authService.getUser();
    if(loggedUser == null)
      return;

    console.log({userId: this.user.id, followerId: loggedUser.id});

    if(this.isFollowing()){
      this.userService.deleteFollower({ userId: this.user.id, followerId: loggedUser.id});

      this.userStats.followers--;

      this.userInteractions.following.splice(this.userInteractions.following?.indexOf(this.user.id), 1);
      this.interactionService.updateUserInteractions(this.userInteractions);
      return;
    }

    this.userService.createFollower({ userId: this.user.id, followerId: loggedUser.id});

    this.userStats.followers++;

    this.userInteractions?.following.push(this.user.id);
    this.interactionService.updateUserInteractions(this.userInteractions);
  }

  handleFavouriteThread(event: any){
    const data = event['data'];

    if(data.action == '+'){
      this.favouriteThreads.push(data.thread);
    }
    if(data.action == "-"){
      this.favouriteThreads.splice(this.favouriteThreads.indexOf(data.thread), 1);
    }
  }

  handleDeleteThread(event: any){
    const data = event['data'];

    if(this.threads.find(thread => thread.id == data.thread.id))
      this.threads.splice(this.threads.indexOf(data.thread), 1);

    if(this.favouriteThreads.find(thread => thread.id == data.thread.id))
      this.favouriteThreads.splice(this.favouriteThreads.indexOf(data.thread), 1);
  }

  handleDeleteComment(event: any){
    const data = event['data'];

    this.comments.splice(this.comments.indexOf(data.comment), 1);
  }
}
