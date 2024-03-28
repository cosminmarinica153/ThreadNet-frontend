import { Signal } from "@angular/core";
import { ContentUser } from "./ContentUser";
import { CommentReplyInteractions } from "./interactions/CommentReplyInteractions";

export interface ICommentReply {
  id: number,
  user: ContentUser,
  commentId?: number,
  content: string,
  uploadDate: Date,
  isEdited: number,
  commentReplyInteractions: CommentReplyInteractions
}
