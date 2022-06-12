/* 
权限数据
*/
export interface PermissionModel {
  id?: string;
  pid?: string;
  code?: string;
  select?: boolean;
  toCode?: string;
  children?: PermissionListModel;

  name: string;
  level: PermissionLevelModel;
  type: 1 | 2;
}
// 权限等级
export type PermissionLevelModel = 0 | 1 | 2 | 3 | 4;

// 权限列表
export type PermissionListModel = PermissionModel[];

// 权限列表接口返回的数据
export interface PermissionListResponseModel {
  children: PermissionListModel;
}
