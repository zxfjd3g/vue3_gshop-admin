// 角色
export interface RoleModel {
  id?: string;
  roleName: string;

  // 页面需要
  originRoleName?: string
  edit?: boolean
}

// 角色列表
export type RoleListModel = RoleModel[];

// 角色分页列表
export interface RolePageListModel {
  items: RoleListModel;
  total: number;
}

// 某个用户的角色列表
export interface UserRoleListModel {
  // 所有角色列表
  allRolesList: RoleListModel;
  // 分配的角色列表
  assignRoles: RoleListModel;
}
