import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  url: string = environment.baseUrl

constructor(private http: HttpClient, private interactionService: InteractionService) { }

  getAllReplies(commentId: number): Observable<ICommentReply[]>{
    return this.http.get<ICommentReply[]>(this.url + "Comment/getReplies" + commentId).pipe(
      map(replies => {

        return replies
      })
    );
  }

  getOneComment(commentId: number): Observable<IComment>{
    return this.http.get<IComment>(this.url + `Comment/getOne${commentId}`);
  }

  getOneReply(replyId: number): Observable<ICommentReply>{
    return this.http.get<ICommentReply>(this.url + `CommentReply/getOne${replyId}`);
  }

  updateComment(newComment: UpdateCommentDto){
    return this.http.put(this.url + `Comment/updateComment`, newComment, {responseType: 'text'});
  }

  updateCommentReply(newReply: UpdateCommentDto){
    return this.http.put(this.url + `CommentReply/updateCommentReply`, newReply, {responseType: 'text'});
  }

  deleteComment(commentId: number){
    return this.http.delete(this.url + `Comment/deleteComment${commentId}`, {responseType: 'text'});
  }

  deleteCommentReply(replyId: number){
    return this.http.delete(this.url + `CommentReply/deleteCommentReply${replyId}`, {responseType: 'text'});
  }

  postComment(commentData: CreateCommentDto): Observable<IComment>{
    return this.http.post<IComment>(this.url + "Comment/createComment", commentData).pipe(
      map(comment => { return comment; })
    );
  }

  postReply(replyData: CreateReplyDto): Observable<ICommentReply>{
    return this.http.post<ICommentReply>(this.url + "CommentReply/createCommentReply", replyData).pipe(
      map(reply => { return reply })
    );
  }

  getAllRepliesSignal(id: number){
    return toSignal<ICommentReply[], ICommentReply[]>(this.getAllReplies(id), {initialValue: []})
  }
}
