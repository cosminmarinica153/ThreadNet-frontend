export interface CreateUserDto {
  Username: string;
  Password: string;
  Email: string;
  RegisterDate: Date;
  IsVerified: number;
  AuthKey: number;
  AuthToken: string;
}
