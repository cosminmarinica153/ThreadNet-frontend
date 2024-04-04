import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IThread } from '@apiModel/IThread';
import { IUser } from '@apiModel/IUser';
import { UserComment } from '@apiModel/UserComment';
import { UserStats } from '@apiModel/interactions/UserStats';
import { FollowerDto } from '@dto/FollowerDto';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url: string = environment.baseUrl;

constructor(private http: HttpClient) { }

  getUser(id: number): Observable<IUser>{
    return this.http.get<IUser>(this.url + `User/getOne${id}`);
  }

  getUserStats(id: number): Observable<UserStats>{
    return this.http.get<UserStats>(this.url + `User/getInteractions${id}`);
  }

  getFavouriteThreads(id: number): Observable<IThread[]>{
    return this.http.get<IThread[]>(this.url + `User/getFavouriteThreads${id}`);
  }

  getUserThreads(id: number): Observable<IThread[]>{
    return this.http.get<IThread[]>(this.url + `User/getThreads${id}`);
  }

  getUserComments(id: number): Observable<UserComment[]>{
    return this.http.get<UserComment[]>(this.url + `User/getComments${id}`);
  }

  getFollowers(id: number): Observable<IUser[]>{
    return this.http.get<IUser[]>(this.url + `User/getFollowers${id}`);
  }

  getFollowing(id: number): Observable<IUser[]>{
    return this.http.get<IUser[]>(this.url + `User/getFollowing${id}`);
  }

  createFollower(follower: FollowerDto){
    return this.http.post(this.url + 'User/createFollower', follower, {responseType: 'text'}).subscribe();
  }
  deleteFollower(follower: FollowerDto){
    return this.http.delete(this.url + 'User/deleteFollower', {responseType: 'text', body: follower}).subscribe();
  }

  // Signals

  getThreadsSignal(id: number){
    return toSignal<IThread[], IThread[]>(this.getUserThreads(id), {initialValue: []});
  }
  getFavouriteThreadsSignal(id: number){
    return toSignal<IThread[], IThread[]>(this.getFavouriteThreads(id), {initialValue: []});
  }

}
