import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IComment } from '@apiModel/IComment';
import { ICommentReply } from '@apiModel/ICommentReply';
import { CreateCommentDto } from '@dto/CreateCommentDto';
import { CreateReplyDto } from '@dto/CreateReplyDto';
import { environment } from 'environments/environment';
import { Observable, map } from 'rxjs';
import { InteractionService } from './interaction.service';
import { UpdateCommentDto } from '@dto/UpdateCommentDto';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

constructor(private http: HttpClient, private interactionService: InteractionService) { }

  getAllReplies(commentId: number): Observable<ICommentReply[]>{
    return this.http.get<ICommentReply[]>(environment.baseUrl + "Comment/getReplies" + commentId).pipe(
      map(replies => {

        return replies
      })
    );
  }

  getOneComment(commentId: number): Observable<IComment>{
    return this.http.get<IComment>(environment.baseUrl + `Comment/getOne${commentId}`);
  }

  getOneReply(replyId: number): Observable<ICommentReply>{
    return this.http.get<ICommentReply>(environment.baseUrl + `CommentReply/getOne${replyId}`);
  }

  updateComment(newComment: UpdateCommentDto){
    return this.http.put(environment.baseUrl + `Comment/updateComment`, newComment, {responseType: 'text'});
  }

  updateCommentReply(newReply: UpdateCommentDto){
    return this.http.put(environment.baseUrl + `CommentReply/updateCommentReply`, newReply, {responseType: 'text'});
  }

  deleteComment(commentId: number){
    return this.http.delete(environment.baseUrl + `Comment/deleteComment${commentId}`, {responseType: 'text'});
  }

  deleteCommentReply(replyId: number){
    return this.http.delete(environment.baseUrl + `CommentReply/deleteCommentReply${replyId}`, {responseType: 'text'});
  }

  postComment(commentData: CreateCommentDto): Observable<IComment>{
    return this.http.post<IComment>(environment.baseUrl + "Comment/createComment", commentData).pipe(
      map(comment => { return comment; })
    );
  }

  postReply(replyData: CreateReplyDto): Observable<ICommentReply>{
    return this.http.post<ICommentReply>(environment.baseUrl + "CommentReply/createCommentReply", replyData).pipe(
      map(reply => { return reply })
    );
  }

  getAllRepliesSignal(id: number){
    return toSignal<ICommentReply[], ICommentReply[]>(this.getAllReplies(id), {initialValue: []})
  }
}
