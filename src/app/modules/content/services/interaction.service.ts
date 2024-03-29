import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FavouriteCategory } from '@apiModel/FavouriteCategory';
import { FavouriteThread } from '@apiModel/FavouriteThread';
import { CommentInteractions } from '@apiModel/interactions/CommentInteractions';
import { CommentReplyInteractions } from '@apiModel/interactions/CommentReplyInteractions';
import { ThreadInteractions } from '@apiModel/interactions/ThreadInteractions';
import { UserCreatedContent } from '@apiModel/interactions/UserCreatedContent';
import { UserInteractions } from '@apiModel/interactions/UserInteractions';
import { CreateVoteDto } from '@dto/CreateVoteDto';
import { DeleteVoteDto } from '@dto/DeleteVoteDto';
import { AuthentificationService } from 'app/modules/auth/authentification.service';
import { environment } from 'environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  pipe(ma: any): CommentReplyInteractions {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient, private authService: AuthentificationService, @Inject(PLATFORM_ID) private platformId: Object) {}

  getUserInteractions(): UserInteractions | null{
    if(isPlatformBrowser(this.platformId)){
      var userInteractions = sessionStorage.getItem('UserInteractions');
      return userInteractions ? JSON.parse(userInteractions) : null;
    }
    return null;
  }

  getUserCreatedContent(): UserCreatedContent | null{
    if(isPlatformBrowser(this.platformId)){
      var userCreatedContent = sessionStorage.getItem('UserCreatedContent');
      return userCreatedContent ? JSON.parse(userCreatedContent) : null;
    }
    return null;
  }

  updateUserInteractions(interactions: UserInteractions){
    if(isPlatformBrowser(this.platformId))
      sessionStorage.setItem('UserInteractions', JSON.stringify(interactions));
  }

  updateUserCreatedContent(userCreatedContent: UserCreatedContent){
    if(isPlatformBrowser(this.platformId))
      sessionStorage.setItem('UserCreatedContent', JSON.stringify(userCreatedContent));
  }

  getThreadVotes(id: number): Observable<ThreadInteractions> {
    return this.http.get<ThreadInteractions>(environment.baseUrl + `Thread/getInteractions${id}`);
  }

  getCommentInteractions(id: number): Observable<CommentInteractions>{
    return this.http.get<CommentInteractions>(environment.baseUrl + 'Comment/getInteractions' + id)
  }

  getCommentReplyInteractions(id: number): Observable<CommentReplyInteractions>{
    return this.http.get<CommentReplyInteractions>(environment.baseUrl + 'CommentReply/getInteractions' + id)
  }

  createFavouriteCategory(fc: FavouriteCategory){
    return this.http.post(environment.baseUrl + `User/createFavouriteCategory`, fc, {responseType: 'text'}).subscribe();
  }
  deleteFavouriteCategory(fc: FavouriteCategory){
    this.http.delete(environment.baseUrl + 'User/deleteFavouriteCategory', { body: fc, responseType: 'text' }).subscribe();
  }

  createFavouriteThread(ft: FavouriteThread){
    return this.http.post(environment.baseUrl + `User/createFavouriteThread`, ft, {responseType: 'text'}).subscribe();
  }
  deleteFavouriteThread(ft: FavouriteThread){
    this.http.delete(environment.baseUrl + 'User/deleteFavouriteThread', { body: ft, responseType: 'text' }).subscribe();
  }


  createVoteThread(vote: CreateVoteDto){
    this.http.post(environment.baseUrl + 'User/createVoteThread', vote, { responseType: 'text' }).subscribe();
  }
  updateVoteThread(vote: CreateVoteDto){
    this.http.put(environment.baseUrl + 'User/updateVoteThread', vote, {responseType: 'text'}).subscribe();
  }
  deleteVoteThread(vote: DeleteVoteDto){
    this.http.delete(environment.baseUrl + 'User/deleteVoteThread', { body: vote, responseType: 'text' }).subscribe();
  }

  createVoteComment(vote: CreateVoteDto){
    this.http.post(environment.baseUrl + 'User/createVoteComment', vote, { responseType: 'text' }).subscribe();
  }
  updateVoteComment(vote: CreateVoteDto){
    this.http.put(environment.baseUrl + 'User/updateVoteComment', vote, {responseType: 'text'}).subscribe();
  }
  deleteVoteComment(vote: DeleteVoteDto){
    this.http.delete(environment.baseUrl + 'User/deleteVoteComment', { body: vote, responseType: 'text' }).subscribe();
  }

  createVoteReply(vote: CreateVoteDto){
    this.http.post(environment.baseUrl + 'User/createVoteCommentReply', vote, { responseType: 'text' }).subscribe();
  }
  updateVoteReply(vote: CreateVoteDto){
    this.http.put(environment.baseUrl + 'User/updateVoteCommentReply', vote, {responseType: 'text'}).subscribe();
  }
  deleteVoteReply(vote: DeleteVoteDto){
    this.http.delete(environment.baseUrl + 'User/deleteVoteCommentReply', { body: vote, responseType: 'text' }).subscribe();
  }

  // Signals

  getCommentInteractionSignal(id: number){
    return toSignal<CommentInteractions, CommentInteractions>(this.getCommentInteractions(id), {initialValue: {upVotes: 0, downVotes: 0, replies: 0}});
  }

  getCommentReplyInteractionSignal(id: number){
    return toSignal<CommentReplyInteractions, CommentReplyInteractions>(this.getCommentReplyInteractions(id), {initialValue: {upVotes: 0, downVotes: 0}});
  }

}
