import request from '@/utils/request'
import type { UserPageListModel, UserModel } from './model/userModel';
import type { UserRoleListModel } from './model/roleModel';

// 定义请求地址的枚举
enum Api {
  GetUserList = '/admin/acl/user',
  RemoveUser = '/admin/acl/user/remove',
  RemoveUsers = '/admin/acl/user/batchRemove',
  SaveUser = '/admin/acl/user/save',
  UpdateUser = '/admin/acl/user/update',
  GetUserRoleList = '/admin/acl/user/toAssign',
  AssignUserRoleList = '/admin/acl/user/doAssign',
}

/**
 * 获取用户分页列表
 * @param page 页码
 * @param limit 每页数量
 * @param searchParams 包含搜索条件的对象 {username: 'xxx'}
 * @returns UserPageListModel
 */
export const getUserListApi = (page: number, limit: number, searchParams: object) => {
  return request.get<any, UserPageListModel>(Api.GetUserList + `/${page}/${limit}`, {
    params: searchParams
  })
};

/**
 * 添加或更新用户
 * @param user 用户对象
 * @returns null
 */
export const saveOrUpdateUserApi = (user: UserModel) => {
  if (user.id) {
    return request.put<any, null>(Api.UpdateUser, user);
  }
  return request.post<any, null>(Api.SaveUser, user);
};

/**
 * 获取用户角色列表
 * @param userId 用户id
 * @returns UserRoleListModel
 */
export const getUserRoleListApi = (userId: string) => {
  return request.get<any, UserRoleListModel>(Api.GetUserRoleList + `/${userId}`);
};

/**
 * 给用户分配角色
 * @param userId 用户id
 * @param roleId 包含所有角色id的字符串 3,5,6
 * @returns 
 */
export const assignUserRoleListApi = (userId: string, roleId: string) => {
  return request.post<any, void>(Api.AssignUserRoleList, null, {
    params: {
      userId,
      roleId
    }
  });
};

/**
 * 删除用户
 * @param id 用户id 
 * @returns null
 */
export const removeUserApi = (id: string) => {
  return request.delete<any, null>(Api.RemoveUser + `/${id}`);
};

/**
 * 批量删除多个用户
 * @param ids 多个用户id组成的数组
 * @returns 
 */
export const removeUsersApi = (ids: string[]) => {
  return request.delete<any, null>(Api.RemoveUsers, {
    data: ids
  });
};