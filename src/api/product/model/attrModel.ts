// 平台属性值接口
export interface AttrValueModel {
  id?: number;
  valueName: string;
  attrId?: number;
  isShowEdit?: boolean; // 标识是否显示ipput
}

// 平台销售值列表
export type AttrValueListModel = AttrValueModel[];

// 平台属性
export interface AttrModel {
  id?: number;
  
  attrName: string;
  categoryId: number;
  categoryLevel: number;
  attrValueList: AttrValueListModel;
}

// 平台属性列表
export type AttrListModel = AttrModel[];

// Pick从AttrModel类型中挑选一些类型组成一个新类型
// export type PickAttrModel = Pick<AttrModel, 'attrName' | 'attrValueList' | 'id'>;
