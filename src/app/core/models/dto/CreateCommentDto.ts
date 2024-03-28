export interface CreateCommentDto {
  userId: number;
  threadId: number;
  content: string;
  uploadDate: Date;
  isEdited: number;
}
