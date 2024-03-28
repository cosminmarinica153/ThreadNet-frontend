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

constructor(private http: HttpClient) { }

  getUser(id: number): Observable<IUser>{
    return this.http.get<IUser>(environment.baseUrl + `User/getOne${id}`);
  }

  getUserStats(id: number): Observable<UserStats>{
    return this.http.get<UserStats>(environment.baseUrl + `User/getInteractions${id}`);
  }

  getFavouriteThreads(id: number): Observable<IThread[]>{
    return this.http.get<IThread[]>(environment.baseUrl + `User/getFavouriteThreads${id}`);
  }

  getUserThreads(id: number): Observable<IThread[]>{
    return this.http.get<IThread[]>(environment.baseUrl + `User/getThreads${id}`);
  }

  getUserComments(id: number): Observable<UserComment[]>{
    return this.http.get<UserComment[]>(environment.baseUrl + `User/getComments${id}`);
  }

  getFollowers(id: number): Observable<IUser[]>{
    return this.http.get<IUser[]>(environment.baseUrl + `User/getFollowers${id}`);
  }

  getFollowing(id: number): Observable<IUser[]>{
    return this.http.get<IUser[]>(environment.baseUrl + `User/getFollowing${id}`);
  }

  createFollower(follower: FollowerDto){
    return this.http.post(environment.baseUrl + 'User/createFollower', follower, {responseType: 'text'}).subscribe();
  }
  deleteFollower(follower: FollowerDto){
    return this.http.delete(environment.baseUrl + 'User/deleteFollower', {responseType: 'text', body: follower}).subscribe();
  }

  // Signals

  getThreadsSignal(id: number){
    return toSignal<IThread[], IThread[]>(this.getUserThreads(id), {initialValue: []});
  }
  getFavouriteThreadsSignal(id: number){
    return toSignal<IThread[], IThread[]>(this.getFavouriteThreads(id), {initialValue: []});
  }

}
