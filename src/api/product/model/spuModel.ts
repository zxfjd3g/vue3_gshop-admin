// 获取SPU分页列表的请求参数
export interface SpuPageListParamsModel {
  page: number;
  limit: number;
  category3Id: number;
}

// SPU图片
export interface SpuImageModel {
  id?: number;
  spuId?: number;
  imgName: string;
  imgUrl: string;
  
  // 为了上传图片使用
  name?: string;
  url?: string;
  response?: {
    data: string
  };
  isDefault?: string
}

// SPU图片列表
export type SpuImageListModel = SpuImageModel[];

// SPU销售属性值
export interface SpuSaleAttrValueModel {
  id?: number;
  spuId?: number
  saleAttrName?: string;

  baseSaleAttrId: number;
  saleAttrValueName: string;
}

// SPU销售属性值列表
export type SpuSaleAttrValueListModel = SpuSaleAttrValueModel[];

// SPU销售属性
export interface SpuSaleAttrModel {
  id?: number;
  spuId?: number;
  baseSaleAttrId: number;
  saleAttrName: string;
  spuSaleAttrValueList: SpuSaleAttrValueListModel;
  
  // 是否显示编辑模式
  isShowEdit?: boolean;
}

// SPU销售属性列表
export type SpuSaleAttrListModel = SpuSaleAttrModel[];

// SPU
export interface SpuModel {
  id?: number;
  category3Id?: number;
  tmId?: number;

  spuName: string;
  description: string;
  spuSaleAttrList: SpuSaleAttrListModel;
  spuImageList: SpuImageListModel;
}

// SPU列表
export type SpuListModel = SpuModel[];

// SPU分页列表
export interface SpuPageListModel {
  records: SpuListModel;
  total: number;
}

// 基础销售属性
export interface BaseSaleAttrModel {
  id: number;
  name: string;
}

// 基础销售属性列表
export type BaseSaleAttrListModel = BaseSaleAttrModel[];
