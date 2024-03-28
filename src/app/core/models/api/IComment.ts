import { Signal } from "@angular/core";
import { ContentUser } from "./ContentUser";
import { ICommentReply } from "./ICommentReply";
import { CommentInteractions } from "./interactions/CommentInteractions";

export interface IComment {
  id: number,
  user: ContentUser,
  threadId?: number,
  content: string,
  uploadDate: Date,
  isEdited: number
  replies: ICommentReply[];
  commentInteractions: CommentInteractions;
}
