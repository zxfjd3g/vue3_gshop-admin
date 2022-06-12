<template>
  <el-card>
    <el-table 
      class="category-list" 
      border 
      lazy 
      :data="categorys" 
      :load="load" style="width:90%; margin-bottom:20px;"
      :row-key="getRowKey" 
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :row-class-name="tableRowClassName">
      <el-table-column prop="id" label="分类ID" align="center" width="150" />

      <el-table-column prop="name" label="分类名称" />

      <el-table-column label="操作" width="250" align="center">
        <template #header>
          <el-input placeholder="按Enter键添加一级分类" />
        </template>

        <template v-slot="{row}">
          <el-button :disabled="!row.level" title="添加子分类" size="small" type="primary" :icon="Plus"/>
          <el-button title="修改分类" size="small" type="primary" :icon="Edit" />
          <el-button title="删除分类" size="small" type="danger" :icon="Delete" />
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts" setup>
import {ref, onMounted} from 'vue'
import {getCategory1ListApi, getCategory2ListApi, getCategory3ListApi} from '@/api/product/category'
import type {CategoryListModel, CategoryModel} from '@/api/product/model/categoryModel'
import {
  ElCard,
  ElTable,
  ElTableColumn,
  ElInput,
  ElButton,
} from 'element-plus'
import {Edit, Delete, Plus} from '@element-plus/icons-vue'

const categorys = ref<CategoryListModel>([])

onMounted(() => getCategorys1())

/* 
获取一级分类列表显示
*/
const getCategorys1 = () => {
  getCategory1ListApi().then(result => {
    result.forEach(c => {
      c.hasChildren = true
      c.level = 1
    })
    categorys.value = result
  })
}

/* 
异步加载下一级分类列表显示
*/
const load = async ( row: CategoryModel, treeNode: unknown,
  resolve: (data: CategoryModel[]) => void) => {
  // console.log('---', row, treeNode)
  if (row.level===1) {
    const categorys2 = await getCategorys2(row)
    resolve(categorys2)
  } else if (row.level===2) {
    const categorys3 = await getCategorys3(row)
    resolve(categorys3)
  }
}

/* 
获取二级分类列表, 返回包含数据的promise对象
*/
const getCategorys2 = (row: CategoryModel) => {
  return getCategory2ListApi(row.id).then(result => {
    if (result && result.length>0) {
      result.forEach(item => {
        // 标识有子分类
        item.hasChildren = true
        // 分类级别为2级
        item.level = 2
      })
      return result
    } else {
      row.hasChildren = false
      return []
    }
  })
}

/* 
获取三级分类列表, 返回包含数据的promise对象
*/
const getCategorys3 = async (row: CategoryModel) => {
  const result = await getCategory3ListApi(row.id)
  if (result && result.length>0) {
    return result
  } else {
    row.hasChildren = false
    return []
  }
}

/* 
动态确定当前行的唯一key
*/
const getRowKey = (row: CategoryModel) => {
  return row.level + '-' + row.id
}

/* 
返回二级分类列表的类名
*/
const tableRowClassName = ({row}: {row: CategoryModel}) => {
  if (row.level === 2) {
    return 'level2-row'
  } 
}

</script>

<style lang="scss">
.category-list {
  .level2-row {
    background: #f0f9eb;
  }
}
</style>