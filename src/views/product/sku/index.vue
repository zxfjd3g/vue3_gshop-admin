<template>
  <el-card class="sku-list">
    <el-table
      border
      stripe
      :data="tableData.data"
      v-loading="tableData.loading"
      row-key="id">
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center" />

      <el-table-column prop="skuName" label="名称"/>

      <el-table-column prop="skuDesc" label="描述"/>

      <el-table-column label="默认图片" width="150" align="center">
        <template v-slot="{row}">
          <el-image :src="row.skuDefaultImg" alt="商品图片" style="width:80px; height:80px" />
        </template>
      </el-table-column>

      <el-table-column prop="weight" label="重量(KG)" />

      <el-table-column prop="price" label="价格(元)"/>

      <el-table-column label="操作" width="250" align="center">
        <template v-slot="{row}">
          <el-button v-if="row.isSale==0" title="上架" type="info" size="small"
            :icon="Top" @click="onSale(row.id)" />
          <el-button v-else title="下架" type="success" size="small"
            :icon="Bottom" @click="cancelSale(row.id)" />
          <el-button title="修改" type="primary" size="small" :icon="Edit"
            @click="toUpdateSku"/>
          <el-button title="查看详情" type="info" size="small" :icon="InfoFilled"
            @click="showSkuInfo(row.id)"/>
          <el-popconfirm :title="`确定删除${row.skuName}吗`" @confirm="deleteSku(row.id)">
            <template #reference>
              <el-button style="margin-left:10px" type="danger" size="small"
                :icon="Delete" title="删除"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

  <el-pagination
    :current-page="tableData.param.page"
    :total="tableData.total"
    :page-size="tableData.param.limit"
    :page-sizes="[10,20,30]"
    style="padding: 20px 0; text-align: center;"
    layout="prev, pager, next, jumper, ->, sizes, total"
    @current-change="getSkuList($event)"
    @size-change="getSkuList(1, $event)"/>

    <el-drawer
      v-model="skuData.isShowSkuInfo"
      :with-header="false"
      size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuData.skuInfo?.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuData.skuInfo?.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuData.skuInfo?.price}}</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="18">
          <div v-if="skuData.skuInfo?.skuAttrValueList && skuData.skuInfo?.skuAttrValueList.length>0">
            <el-tag type="success" style="margin-right: 5px" 
              v-for="value in skuData.skuInfo?.skuAttrValueList" :key="value.id">
                {{value.attrName + '-' + value.valueName}}
            </el-tag>
          </div>
          <div v-else>无</div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">销售属性</el-col>
        <el-col :span="18">
          <div v-if="skuData.skuInfo?.skuSaleAttrValueList && skuData.skuInfo?.skuSaleAttrValueList.length>0">
            <el-tag type="success" style="margin-right: 5px" v-for="value in skuData.skuInfo?.skuSaleAttrValueList" :key="value.id">
              {{value.saleAttrName + '-' + value.saleAttrValueName}}
            </el-tag>
          </div>
          <div v-else>无</div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
           <el-carousel class="sku-carousel" trigger="click" height="400px" style="width: 400px">
              <el-carousel-item v-for="item in skuData.skuInfo?.skuImageList" :key="item.id">
                <img :src="item.imgUrl" alt="" style="width: 100%;height: 100%;">
              </el-carousel-item>
            </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </el-card>
</template>

<script lang="ts">
export default {
  name: 'SkuList',
}
</script>

<script lang="ts" setup>
import {ElCard, ElDrawer, ElRow, ElCol, ElCarousel, ElCarouselItem, 
  ElPagination, ElTable, ElTableColumn, ElTag, ElPopconfirm, ElImage, ElButton, ElMessage} from 'element-plus'
import {Top, Bottom, Edit, InfoFilled, Delete} from '@element-plus/icons-vue'
import { reactive, toRefs, onMounted } from 'vue';
import { getSkuListApi, deleteSkuApi, onSaleApi, cancelSaleApi, getSkuInfoApi } from '@/api/product/sku';
import type {SkuModel, SkuListModel} from '@/api/product/model/skuModel'

interface TableDataState {
  tableData: {
    data: SkuListModel;
    total: number;
    loading: boolean;
    param: {
      page: number;
      limit: number;
    };
  };
}

interface SkuState {
  skuData: {
    skuInfo: SkuModel|undefined;
    isShowSkuInfo: boolean;
  }
}

const tableDataState = reactive<TableDataState>({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      page: 1,
      limit: 10
    }
  }
})

const skuState = reactive<SkuState>({
  skuData: {
    skuInfo: undefined,
    isShowSkuInfo: false
  }
})

// 初始化获取sku列表
onMounted(() => {
  getSkuList()
})

/* 
进入sku修改界面
*/
const toUpdateSku = () => {
  ElMessage.info('正在开发中...')
}

/*
异步获取指定页码的sku列表
*/
const getSkuList = async (
  page: number = tableDataState.tableData.param.page, 
  limit: number = tableDataState.tableData.param.limit
) =>{
  tableDataState.tableData.param.page = page
  tableDataState.tableData.param.limit = limit
  tableDataState.tableData.loading = true
  const result = await getSkuListApi(page, limit)
  const {records,total} = result
  tableDataState.tableData.data = records
  tableDataState.tableData.total = total
  tableDataState.tableData.loading = false
}

/*
删除SKU
*/
const deleteSku = async (skuId: number) => {
  await deleteSkuApi(skuId)
  ElMessage.success('删除SKU成功')
  getSkuList(1)
}

/*
对指定SKU进行上架的请求
*/
const onSale = (skuId: number) => {
  onSaleApi(skuId).then(result => {
    ElMessage({
      type: 'success',
      message: '上架成功!'
    })
    getSkuList()
  })
}

/*
对指定SKU进行下架的请求
*/
const cancelSale = (skuId: number) => {
  cancelSaleApi(skuId).then(result => {
    ElMessage({
      type: 'success',
      message: '下架成功!'
    })
    getSkuList()
  })
}

/* 
显示sku详情
*/
const showSkuInfo = async (id: number) => {
  skuState.skuData.isShowSkuInfo = true
  const result = await getSkuInfoApi(id)
  skuState.skuData.skuInfo = result
}

const {tableData} = toRefs(tableDataState)
const {skuData} = toRefs(skuState)
</script>

<style lang="scss">
  .sku-list {
    .el-drawer__body {
      overflow: auto;
      &::-webkit-scrollbar { //&: 父级引用
        display: none;
      }
    }
  }
  
</style>

<style lang="scss" scoped>
/* 
  scoped样式: 作用域样式
    能影响当前组件的所有标签及子组件的根标签, 不能影响子组件的所有子标签
  修改子组件(自己的或第三方的)内部的子组件的样式
    如果用上了scoped了, 必须使用'深度作用域选择器'   ::v-deep写在选择器左侧
    如果不用scoped, 不需要使用'深度作用域选择器', 但最好放在组件的根类名下
*/
  .sku-list {
    .el-row {
      margin: 10px 0;
      .el-col-5 {
        text-align: right;
        margin-right: 10px;
        font-size: 20px;
      }
    }

    /* 
    修改第三方组件样式
      1. 让Drawer形成竖直滚动
      2. 修改carousel的指示器的样式
      <div  class="el-carousel__indicator is-acttive">
        <button></button>
      </div>
    */
    :deep(.el-carousel__indicator) {
      button {
        background-color: pink;
      }
      &.is-active {
        button {
          background-color: hotpink;
        }
      }
    }
  }
</style>