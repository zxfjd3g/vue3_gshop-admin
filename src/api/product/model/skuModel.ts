
// SKU图片
export interface SkuImageModel {
  id?: number;
  skuId?: number;
  imgName: string;
  imgUrl: string;
  isDefault: string; // '0' | '1' 默认
  spuImgId: number; // spu图片id
}

// SKU图片列表
export type SkuImageListModel = SkuImageModel[];

// SKU属性值
export interface SkuAttrValueModel {
  id?: number;
  skuId?: number;
  valueName?: string;
  attrName?: string;
  attrId: number;
  valueId: number;
}

// SKU属性值列表
export type SkuAttrValueListModel = SkuAttrValueModel[];

// SKU销售属性值
export interface SkuSaleAttrValueModel {
  id?: number;
  skuId?: number;
  spuId?: number;
  saleAttrId?: number;
  saleAttrName?: string;
  saleAttrValueName?: string;
  saleAttrValueId: number;
}

// SKU销售属性列表
export type SkuSaleAttrValueListModel = SkuSaleAttrValueModel[];

// SKU详情
export interface SkuModel {
  id?: number;
  spuId?: number;
  price: number;
  skuName: string;
  skuDesc: string;
  weight: number;
  tmId: number | undefined;
  category3Id?: number;
  skuDefaultImg: string;
  isSale?: 0|1; // 0 下架 / 1 在卖
  skuImageList: SkuImageListModel;
  skuAttrValueList: SkuAttrValueListModel;
  skuSaleAttrValueList: SkuSaleAttrValueListModel;
}

// SKU列表
export type SkuListModel = SkuModel[];

// SKU分页列表
export interface SkuPageListModel {
  records: SkuListModel;
  total: number;
}
