/**
 * 定义接口来定义对象的类型
 * `stores` 全部类型定义在这里
 */

import type { RouteRecordRaw } from "vue-router";

// 用户信息包括权限数据
export interface UserInfoState {
  token: string;
	avatar: string;
	name: string;

  authBtnList: string[];
  roles: string[];
  menuRoutes: RouteRecordRaw[];

	isColumnsMenuHover?: boolean;
	isColumnsNavHover?: boolean;
}




