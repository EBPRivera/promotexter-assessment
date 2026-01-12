import { Role } from "../enums/role.enum"

export interface IUserRequest {
  user: {
    id: number,
    username: string,
    role: Role
  }
}