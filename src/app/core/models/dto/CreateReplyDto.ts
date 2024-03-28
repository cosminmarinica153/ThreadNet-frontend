export interface CreateReplyDto {
  userId: number;
  commentId: number;
  content: string;
  uploadDate: Date;
  isEdited: number;
}

