import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IComment } from '@apiModel/IComment';
import { IThread } from '@apiModel/IThread';
import { IUser } from '@apiModel/IUser';
import { CreateThreadDto } from '@dto/CreateThreadDto';
import { environment } from 'environments/environment';
import { Observable, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop'
import { InteractionService } from './interaction.service';
import { CommentService } from './comment.service';
import { UpdateThreadDto } from '@dto/UpdateThreadDto';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {

  constructor(private http: HttpClient, private interactionService: InteractionService, private commentService: CommentService) { }

  getAll(): Observable<IThread[]>{
    return this.http.get<IThread[]>(environment.baseUrl + "Thread/getAll");
  }

  getOne(id: number): Observable<IThread>{
    return this.http.get<IThread>(environment.baseUrl + `Thread/getOne` + id);
  }

  getThreadComments(id: number): Observable<IComment[]>{
    return this.http.get<IComment[]>(environment.baseUrl + "Thread/getComments" + id);
  }

  getDiscussionParticipants(id: number): Observable<IUser[]>{
    return this.http.get<IUser[]>(environment.baseUrl + 'Thread/getDiscussionParticipants' + id);
  }

  postThread(thread: CreateThreadDto): Observable<IThread> {
    return this.http.post<IThread>(environment.baseUrl + "Thread/createThread", thread).pipe(
      map(data => {return data})
    );
  }

  updateThread(newThread: UpdateThreadDto){
    return this.http.put(environment.baseUrl + `Thread/updateThread`, newThread, {responseType: 'text'})
  }

  deleteThread(id: number){
    return this.http.delete(environment.baseUrl + `Thread/deleteThread${id}`, {responseType: 'text'});
  }

  // Angular Signals

  getAllSignal(){
    return toSignal<IThread[], IThread[]>(this.getAll(), {initialValue: []})
  }

  getThreadCommentsSignal(id: number){
    return toSignal<IComment[], IComment[]>(this.getThreadComments(id), {initialValue: []})
  }

  getDiscussionPartipantsSignal(id: number){
    return toSignal<IUser[], IUser[]>(this.getDiscussionParticipants(id), {initialValue: []})
  }

}
