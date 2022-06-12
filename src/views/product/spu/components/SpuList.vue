<template>
  <div>
    <el-button @click="showSpuAdd" type="primary" icon="el-icon-plus" :disabled="!categoryStore.category3Id">添加SPU</el-button>
   
    <el-table
      style="margin: 20px 0;"
      :data="spuList"
      row-key="id"
      border>
      <el-table-column
        label="序号"
        width="80"
        align="center">
        <template v-slot="{$index}">{{pageSize * (current-1) + $index + 1}}</template>
      </el-table-column>
      <el-table-column
        label="SPU名称"
        prop="spuName">
      </el-table-column>
      <el-table-column
        label="SPU描述"
        prop="description">
      </el-table-column>
      <el-table-column
        label="操作">
        <template v-slot="{row}">
          <el-button @click="showSkuAdd(row)" title="添加SKU" type="primary" :icon="Plus" size="small"></el-button>
          <el-button @click="showSpuUpdate(row)" title="修改SPU" type="primary" :icon="Edit" size="small"></el-button>
          <el-button @click="showSkuList(row)" title="查看SKU列表" type="info" :icon="InfoFilled" size="small"></el-button>
          <el-button title="删除SPU" type="danger" :icon="Delete" size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="current"
      :page-sizes="[3, 6, 9]"
      :page-size="pageSize"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="getSpuList"
      @size-change="getSpuList(1, $event)">
    </el-pagination>

    <el-dialog :title="`${spu?.spuName} => SKU列表`" v-model="isShowDialog">
      <el-table :data="skuList" v-loading="loading">
        <el-table-column property="skuName" label="名称"></el-table-column>
        <el-table-column property="price" label="价格(元)"></el-table-column>
        <el-table-column property="weight" label="重量(KG)"></el-table-column>
        <el-table-column label="默认图片">
          <template v-slot="{row}">
            <el-image
              style="width: 100px; height: 100px"
              :src="row.skuDefaultImg"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SpuList',
}
</script>

<script lang="ts" setup>
  import { ElButton, ElTable, ElTableColumn, ElImage, ElDialog, ElPagination } from 'element-plus';
  import {Plus, Edit, InfoFilled, Delete} from '@element-plus/icons-vue'
  import {ref, watch} from 'vue'
  import type { SpuListModel, SpuModel } from '@/api/product/model/spuModel';
  import type { SkuListModel } from '@/api/product/model/skuModel';
  import { getSpuListApi } from '@/api/product/spu';
  import { findSkuListBySpuIdApi } from '@/api/product/sku';
  import {ShowStatus} from '../types'
  import { useCategoryStore } from '@/stores/category';

  const categoryStore = useCategoryStore();
  // 定义事件
  const emits = defineEmits(['setShowStatus', 'setCurrentSpu']);

  const spuList = ref<SpuListModel>([])
  const total = ref<number>(0)
  const current = ref<number>(1)
  const pageSize = ref<number>(3)

  const isShowDialog = ref(false)
  const spu = ref<SpuModel>()
  const loading = ref(false)
  const skuList = ref<SkuListModel>([])

  /* 
  显示SPU添加界面
  */
  const showSpuAdd = () => {
    emits('setShowStatus', ShowStatus.ADD_SPU);
    emits('setCurrentSpu');
  }

  /**
   * 显示SPU更新界面
   * @param row 
   */
  const showSpuUpdate = (row: SpuModel) => {
    emits('setShowStatus', ShowStatus.ADD_SPU);
    emits('setCurrentSpu', {
      ...row,
      spuImageList: [],
      spuSaleAttrList: []
    });
  }

  /**
   * 显示SKU添加界面
   * @param row 
   */
  const showSkuAdd = (row: SpuModel) => {
    emits('setShowStatus', ShowStatus.ADD_SKU);
    emits('setCurrentSpu', {
      ...row,
      spuImageList: [],
      spuSaleAttrList: [],
    });
  }

  /**
   * 获取指定页码的列表显示
   * @param page 页码
   * @param limit 每页数量
   */
  const getSpuList = async (page=current.value, limit=pageSize.value) => {
    // 更新当前页码
    current.value = page
    pageSize.value = limit
    // 发请求获取
    const result = await getSpuListApi ({ page, limit, category3Id: categoryStore.getCategory3Id as number })
    // 读取更新数据
    spuList.value = result.records
    total.value = result.total
  }

  /* 
  监视三级分类的变化, 当其没值时, 重置数据, 当有值时, 获取SPU列表
  */
  watch(
    () => categoryStore.category3Id,
    (category3Id) => {
      if (!category3Id) {
        spuList.value = [];
        current.value = 1;
        pageSize.value = 3;
        total.value = 0;
        return;
      }

      getSpuList();
    },
    { immediate: true },
  )

  /**
   * 显示指定spu下的sku列表
   * @param row spu对象
   */
  const showSkuList = async (row: SpuModel) => {
    isShowDialog.value = true
    spu.value = row
    loading.value = true
    // 发请求
    skuList.value = await findSkuListBySpuIdApi(row.id as number)
    loading.value = false
  }
</script>

<style scoped>

</style>
