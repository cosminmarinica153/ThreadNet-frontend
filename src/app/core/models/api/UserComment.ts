import { IThread } from "./IThread";
import { CommentReplyInteractions } from "./interactions/CommentReplyInteractions";

export interface UserComment {
  id: number,
  threadId: number,
  content: string,
  uploadDate: Date,
  isEdited: number,
  interactions: CommentReplyInteractions,
  type: string
}
