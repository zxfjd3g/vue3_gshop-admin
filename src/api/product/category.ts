// 引入发送请求的函数对象
import request from '@/utils/request';
// 引入响应返回值的数据类型
import type { CategoryListModel } from './model/categoryModel';

// 定义请求地址的枚举
enum Api {
  GetCategory1List = '/admin/product/getCategory1',
  GetCategory2List = '/admin/product/getCategory2',
  GetCategory3List = '/admin/product/getCategory3',
}

/**
 * 获取一级分类
 * @returns CategoryListModel
 */
export const getCategory1ListApi = () => {
  return request.get<any, CategoryListModel>(Api.GetCategory1List);
};

/**
 * 获取二级分类
 * @param category1Id 一级分类id
 * @returns CategoryListModel
 */
export const getCategory2ListApi = (category1Id: number) => {
  return request.get<any, CategoryListModel>(Api.GetCategory2List + `/${category1Id}`);
};

/**
 * 获取三级分类
 * @param category2Id 二级分类id
 * @returns CategoryListModel
 */
export const getCategory3ListApi = (category2Id: number) => {
  return request.get<any, CategoryListModel>(Api.GetCategory3List + `/${category2Id}`);
};
