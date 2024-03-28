export interface IUser {
  id: number,
  email: string,
  username: string,
  password: string,
  registerDate: Date,
  isVerified: number,
  authToken: string,
  authKey: number
}
