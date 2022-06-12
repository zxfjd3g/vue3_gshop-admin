/* 
管理员用户
*/
export interface UserModel {
  id?: string;
  roleName?: string[];
  username: string;
  nickName: string;
  password: string;
}

// 管理员用户列表
export type UserListModel = UserModel[];

// 管理员用户分页列表
export interface UserPageListModel {
  items: UserListModel;
  total: number;
}
