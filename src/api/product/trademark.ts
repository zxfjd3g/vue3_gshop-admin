// 引入发送请求的函数对象
import request from '@/utils/request';

// 引入响应返回值的数据类型
import type {
  TrademarkPageListModel,
  TrademarkModel,
  TrademarkListModel,
} from './model/trademarkModel';

// 定义请求地址的枚举
enum Api {
  GetTrademarkList = '/admin/product/baseTrademark',
  GetAllTrademarkList = '/admin/product/baseTrademark/getTrademarkList',
  SaveTrademark = '/admin/product/baseTrademark/save',
  DeleteTrademark = '/admin/product/baseTrademark/remove',
  UpdateTrademark = '/admin/product/baseTrademark/update',
}

/**
 * 获取所有品牌列表
 * @returns TrademarkListModel
 */
export const getAllTrademarkListApi = () => {
  return request.get<any, TrademarkListModel>(Api.GetAllTrademarkList);
};

/**
 * 获取品牌分页列表
 * @param page 当前页码
 * @param limit 每页条数
 * @returns TrademarkListResponseModel
 */
export const getTrademarkListApi = (page: number, limit: number) => {
  return request.get<any, TrademarkPageListModel>(Api.GetTrademarkList + `/${page}/${limit}`);
};

/**
 * 添加品牌
 * @param tmName 品牌名称
 * @param logoUrl 品牌logo
 * @returns null
 */
export const saveTrademarkApi = (tmName: string, logoUrl: string) => {
  return request.post<any, null>(Api.SaveTrademark, {
    tmName,
    logoUrl,
  });
};

/**
 * 更新品牌
 * @param tm 品牌对象
 * @returns null
 */
export const updateTrademarkApi = (tm: TrademarkModel) => {
  return request.put<any, null>(Api.UpdateTrademark, tm);
};

/**
 * 删除品牌
 * @param id 品牌id
 * @returns null
 */
export const deleteTrademarkApi = (id: number) => {
  return request.delete<any, null>(Api.DeleteTrademark + `/${id}`);
};


