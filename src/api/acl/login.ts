import type { loginResponseModel, userInfoResponseModel } from './model/login';
import request from '@/utils/request';

enum Api {
  Login = '/admin/acl/index/login',
  Logout = '/admin/acl/index/logout',
  getUserInfo = '/admin/acl/index/info',
}

export const loginApi = (username: string, password: string) => {
  return request.post<any, loginResponseModel>(Api.Login, {username, password})
}

export const logoutApi = () => {
  return request.post<any, any>(Api.Logout)
}

export const getUserInfoApi = () => {
  return request.get<any, userInfoResponseModel>(Api.getUserInfo)
}

