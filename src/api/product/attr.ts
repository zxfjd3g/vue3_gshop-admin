import request from '@/utils/request';
import type { CategoryIdsModel } from './model/categoryModel';
import type { AttrListModel, AttrModel } from './model/attrModel';

// 定义请求地址的枚举
enum Api {
  GetAttrList = '/admin/product/attrInfoList',
  AddOrUpdateAttr = '/admin/product/saveAttrInfo',
  DeleteAttr = '/admin/product/deleteAttr'
}

/**
 * 获取属性列表
 * @param categoryIds 三级分类id对象
 * @returns AttrListModel
 */
export const getAttrListApi = ({
  category1Id,
  category2Id,
  category3Id,
}: CategoryIdsModel) => {
  return request.get<any, AttrListModel>(Api.GetAttrList + `/${category1Id}/${category2Id}/${category3Id}`);
};

/**
 * 添加或更新属性
 * @param attr 属性对象
 * @returns null
 */
export const addOrUpdateAttrApi = (attr: AttrModel) => {
  return request.post<any, null>(Api.AddOrUpdateAttr, attr);
};

/**
 * 删除属性
 * @param id
 * @returns null
 */
export const deleteAttrApi = (id: number) => {
  return request.delete<any, null>(Api.DeleteAttr + `/${id}`)
};
