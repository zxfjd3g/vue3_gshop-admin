// 分类
export interface CategoryModel {
  id: number;
  name: string;

  // 页面显示需要
  hasChildren?: boolean; // 标识是否有子分类
  level?: number // 标识是第几级分类
}

// 分类列表
export type CategoryListModel = CategoryModel[];

// number和undefined 类型别名
export type Numberable = number | undefined

// 三个级别分类id => 用于约束请求接口的条件参数
export interface CategoryIdsModel {
  category1Id: Numberable;
  category2Id: Numberable;
  category3Id: Numberable;
}

// pinia管理的分类状态
export interface CategoryStateModel extends CategoryIdsModel {
  category1List: CategoryListModel;
  category2List: CategoryListModel;
  category3List: CategoryListModel;
}