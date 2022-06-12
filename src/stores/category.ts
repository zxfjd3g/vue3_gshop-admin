import { defineStore } from 'pinia'
import {
  getCategory1ListApi,
  getCategory2ListApi,
  getCategory3ListApi,
} from '@/api/product/category'
import type { CategoryStateModel, Numberable, CategoryListModel } from '@/api/product/model/categoryModel'

/* 
管理商品分类数据
*/
export const useCategoryStore = defineStore({
  id: 'category',
  
  // state 数据可读可写
  state: (): CategoryStateModel => ({
    category1Id: undefined,
    category2Id: undefined,
    category3Id: undefined,
    category1List: [],
    category2List: [],
    category3List: []
  }),

  // getters 只读的计算属性数据
  getters: {
    getCategory1Id(): Numberable {
      return this.category1Id
    },
    getCategory2Id(): Numberable {
      return this.category2Id
    },
    getCategory3Id(): Numberable {
      return this.category3Id
    },
    getCategory1List(): CategoryListModel {
      return this.category1List
    },
    getCategory2List(): CategoryListModel {
      return this.category2List
    },
    getCategory3List(): CategoryListModel {
      return this.category3List
    },
  },

  // actions 发送请求更新数据的方法
  // Tip: 如果只需要直接更新数据，直接更新state就OK了
  actions: {
    // 请求获取一级分类
    async setCategory1List() {
      this.category1List = await getCategory1ListApi()
    },

    // 请求获取二级分类列表
    async setCategory2List(category1Id: number) {
      this.category1Id = category1Id
      this.category2List = await getCategory2ListApi(category1Id)
      // 清空数据
      this.category2Id = undefined
      this.category3Id = undefined
      this.category3List = []
    },

    // 请求获取三级分类列表
    async setCategory3List(category2Id: number) {
      this.category2Id = category2Id
      this.category3List = await getCategory3ListApi(category2Id)
      this.category3Id = undefined
    },
  },
})

export default useCategoryStore