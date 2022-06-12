import request from '@/utils/request';
import type {
  SpuPageListParamsModel,
  SpuPageListModel,
  BaseSaleAttrListModel,
  SpuModel,
  SpuImageListModel,
  SpuSaleAttrListModel,
} from './model/spuModel';

// 定义请求地址的枚举
enum Api {
  GetSpuList = '/admin/product',
  GetBaseSaleAttrList = '/admin/product/baseSaleAttrList',
  SaveSpu = '/admin/product/saveSpuInfo',
  UpdateSpu = '/admin/product/updateSpuInfo',
  GetSpuSaleAttrList = '/admin/product/spuSaleAttrList',
  GetSpuImageList = '/admin/product/spuImageList',
  GetSpuInfo = '/admin/product/getSpuById',

}

/**
 * 获取属性列表
 * @param categoryIds 三级分类id对象
 * @returns
 */
export const getSpuListApi = ({ page, limit, category3Id }: SpuPageListParamsModel) => {
  return request.get<any, SpuPageListModel>(Api.GetSpuList + `/${page}/${limit}`, {
    params: {
      category3Id,
    },
  });
};

/**
 * 获取基础销售属性列表
 * @returns BaseSaleAttrListModel
 */
export const getBaseSaleAttrListApi = () => {
  return request.get<any, BaseSaleAttrListModel>(Api.GetBaseSaleAttrList);
};

/**
 * 添加或更新SPU
 * @param spu spu对象
 * @returns null
 */
export const addOrUpdateSpuApi = (spu: SpuModel) => {
  return request.post<any, null>(spu.id ? Api.UpdateSpu : Api.SaveSpu, spu);
};

/**
 * 获取图片列表
 * @param spuId
 * @returns
 */
export const getSpuImageListApi = (spuId: number) => {
  return request.get<any, SpuImageListModel>(Api.GetSpuImageList + `/${spuId}`);
};

/**
 * 获取销售属性列表
 * @param spuId
 * @returns
 */
export const getSpuSaleAttrListApi = (spuId: number) => {
  return request.get<any, SpuSaleAttrListModel>(Api.GetSpuSaleAttrList + `/${spuId}`);
};

/**
 * 获取SPU详情
 * @param spuId
 * @returns
 * 
 */
export const getSpuInfoApi = (spuId: number) => {
  return request.get<any, SpuModel>(Api.GetSpuInfo + `/${spuId}`);
};
