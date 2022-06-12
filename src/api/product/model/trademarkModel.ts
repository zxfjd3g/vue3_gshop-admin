// 品牌
export interface TrademarkModel {
  id?: number;
  tmName: string;
  logoUrl: string;
}

// 品牌列表
export type TrademarkListModel = TrademarkModel[];

// 品牌分页列表返回数据
export interface TrademarkPageListModel {
  total: number;
  records: TrademarkListModel;
}
