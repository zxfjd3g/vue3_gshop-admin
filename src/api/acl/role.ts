import request from '@/utils/request';
import type { RolePageListModel, RoleModel } from './model/roleModel';
import type { PermissionModel } from './model/permissionModel';
// 定义请求地址的枚举
enum Api {
  GetRoleList = '/admin/acl/role',
  RemoveRole = '/admin/acl/role/remove',
  RemoveRoles = '/admin/acl/role/batchRemove',
  SaveRole = '/admin/acl/role/save',
  UpdateRole = '/admin/acl/role/update',
  AssignRole = '/admin/acl/permission/doAssign',
  GetAssignRole = '/admin/acl/permission/toAssign',
}

/**
 * 获取角色分页列表(带搜索)
 * @param page 页码
 * @param limit 每页数量
 * @param roleName 搜索的角色名称
 * @returns RolePageListModel
 */
export const getRoleListApi = (page: number, limit: number, roleName: string) => {
  return request.get<any, RolePageListModel>(Api.GetRoleList + `/${page}/${limit}`, {
    params: {
      roleName
    }
  });
};

/**
 * 保存一个新角色
 * @param role 角色对象
 * @returns null
 */
export const saveRoleApi = (role: RoleModel) => {
  return request.post<any, null>(Api.SaveRole, role);
};

/**
 * 给某个角色授权
 * @param roleId 角色ID
 * @param permissionId 多个权限id组成的字符串  2,3,4
 * @returns null
 */
export const assignRoleApi = (roleId: string, permissionId: string) => {
  return request.post<any, null>(Api.AssignRole, null, {
    params: {
      roleId,
      permissionId
    },
  });
};

/**
 * 获取一个角色的所有权限列表
 * @param roleId 角色id
 * @returns PermissionModel
 */
export const getAssignRoleApi = (roleId: string) => {
  return request.get<any, PermissionModel>( Api.GetAssignRole + `/${roleId}`);
};

/**
 * 更新一个角色
 * @param role 角色对象
 * @returns null
 */
export const updateRoleApi = (role: RoleModel) => {
  return request.put<any, null>( Api.UpdateRole, role);
};

/**
 * 删除某个角色
 * @param id 角色id
 * @returns null
 */
export const removeRoleApi = (id: string) => {
  return request.delete<any, null>( Api.RemoveRole + `/${id}`);
};

/**
 * 批量删除多个角色
 * @param ids 角色id的数组
 * @returns null
 */
export const removeRolesApi = (ids: string[]) => {
  return request.delete<any, null>(Api.RemoveRoles, {
    data: ids
  });
};