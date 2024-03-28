import { ContentUser } from "./ContentUser";
import { IComment } from "./IComment";
import { ThreadInteractions } from "./interactions/ThreadInteractions";

export interface IThread {
  id: number,
  user: ContentUser,
  categoryId?: number,
  title: string,
  content: string,
  uploadDate: Date,
  isEdited: number
  comments?: IComment[]
  threadInteractions: ThreadInteractions;
}
