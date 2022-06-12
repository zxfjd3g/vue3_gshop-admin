import request from '@/utils/request';
import type { SkuModel, SkuListModel, SkuPageListModel } from './model/skuModel';

// 定义请求地址的枚举
enum Api {
  SaveSku = '/admin/product/saveSkuInfo',
  FindSkuListBySpuId = '/admin/product/findBySpuId',
  GetSkuList = '/admin/product/list',
  OnSale = '/admin/product/onSale',
  CancelSale = '/admin/product/cancelSale',
  DeleteSku = '/admin/product/deleteSku',
  GetSkuInfo = '/admin/product/getSkuById'
}

/**
 * 添加SKU
 * @param sku
 * @returns
 */
export const saveSkuApi = (sku: SkuModel) => {
  return request.post<any, null>(Api.SaveSku, sku);
};

/**
 * 根据spuId找sku列表
 * @param sku
 * @returns
 */
export const findSkuListBySpuIdApi = (spuId: number) => {
  return request.get<any, SkuListModel>(Api.FindSkuListBySpuId + `/${spuId}`);
};

/**
 * 获取sku分页列表
 * @param page
 * @param limit
 * @returns
 */
export const getSkuListApi = (page: number, limit: number) => {
  return request.get<any, SkuPageListModel>(Api.GetSkuList + `/${page}/${limit}`);
};

/**
 * 上架
 * @param skuId
 * @returns
 */
export const onSaleApi = (skuId: number) => {
  return request.get<any, null>(Api.OnSale + `/${skuId}`);
};

/**
 * 下架
 * @param skuId
 * @returns
 */
export const cancelSaleApi = (skuId: number) => {
  return request.get<any, null>(Api.CancelSale + `/${skuId}`);
};

/**
 * 删除SKU
 * @param skuId
 * @returns
 */
export const deleteSkuApi = (skuId: number) => {
  return request.delete<any, null>(Api.DeleteSku + `/${skuId}`);
};

/**
 * 获取SKU详情
 * @param skuId
 * @returns
 */
export const getSkuInfoApi = (skuId: number) => {
  return request.get<any, SkuModel>(Api.GetSkuInfo + `/${skuId}`);
};
