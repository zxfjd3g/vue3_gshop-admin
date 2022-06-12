<template>
  <div>
    <el-card style="margin-bottom: 10px">
      <category-selector :disabled="!isShowAttrList"/>
    </el-card>

    <el-card>
      <div v-if="isShowAttrList">
        <el-button type="primary" :icon="Plus" :disabled="!categoryStore.getCategory3Id" 
          @click="showAdd">添加属性</el-button>
        <el-table
          :data="attrList"
          border
          row-key="id">
          <el-table-column
            label="序号"
            type="index"
            width="80"
            align="center">
          </el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150">
          </el-table-column>
          <el-table-column
            label="属性值列表">
            <template v-slot="{row}">
              <el-tag style="margin-right: 5px" type="success" v-for="item in row.attrValueList" :key="item.id">{{item.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="150">
            <template v-slot="{row}">
              <el-button style="margin-right: 10px" @click="showUpdate(row)" title="修改属性" 
                type="primary" :icon="Edit" size="small"></el-button>
              <el-popconfirm
                :title="`确定删除${row.attrName}吗?`"
                @confirm="remove(row.id)"
              >
                <template #reference>
                  <el-button title="删除属性" type="danger" :icon="Delete" size="small"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <span>属性名</span>
        <el-input style="width: 200px;margin-left: 20px" v-model="attr.attrName" placeholder="请输入属性名"></el-input>
        <br>

        <div style="margin: 20px 0">
          <el-button :disabled="!attr.attrName" type="primary" icon="el-icon-plus" @click="addValue">添加属性值</el-button>
          <el-button @click="isShowAttrList = true">取消</el-button>
        </div>

        <el-table
          style="margin-bottom: 20px"
          :data="attr.attrValueList"
          v-loading="loading">
          <el-table-column
            label="序号"
            type="index"
            width="80">
          </el-table-column>
          <el-table-column
            label="属性值名称">
            <template v-slot="{row, $index}">
              <el-input 
                :ref="(input: any) => inputsRef[$index] = input" 
                @blur="showSpan(row, $index)" 
                v-model="row.valueName" 
                v-if="row.isShowEdit" size="small"></el-input>
              <span style="display: inline-block;width: 100%;" 
                v-else @click="showInput(row, $index)">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作" >
            <template v-slot="{row, $index}">
              <el-popconfirm
                :title="`确定删除${row.valueName}吗?`"
                @confirm="() => {attr.attrValueList.splice($index, 1)}"
              > 
                <template #reference>
                  <el-button title="删除" type="danger" :icon="Delete" size="small"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" @click="save" :disabled="isSaveDisabled">保存</el-button>
        <el-button @click="isShowAttrList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'Attr',
  }
</script>

<script lang="ts" setup>
  import cloneDeep from 'lodash/cloneDeep'
  import { nextTick, computed, ref, reactive, watch } from 'vue'
  import { ElCard, ElButton, ElTable, ElTableColumn, ElPopconfirm, ElInput, ElTag, ElMessage } from 'element-plus';
  import { Plus, Edit, Delete } from '@element-plus/icons-vue';
  import CategorySelector from '@/components/CategorySelector/index.vue'
  import type { AttrListModel, AttrModel, AttrValueModel } from '@/api/product/model/attrModel';
  import { getAttrListApi, addOrUpdateAttrApi, deleteAttrApi } from '@/api/product/attr';
  import { useCategoryStore } from '@/stores/category';

  const categoryStore = useCategoryStore();
  const loading = ref(false)
  const attrList = ref<AttrListModel>([])
  const attr = reactive<AttrModel>({ // 要添加或更新的属性对象
    attrName: '', // 属性名
    attrValueList: [], // 属性值列表
    categoryId: -1,
    categoryLevel: 3
  })
  const isShowAttrList = ref<boolean>(true);
  const inputsRef = ref<HTMLInputElement[]>([])


  // 等category3Id有值的时候才需要发送请求
  watch(
    // 监视的数据
    () => categoryStore.category3Id,
    // 触发的函数
    async (category3Id) => {
      if (!category3Id) {
        attrList.value = [];
        return;
      }
      getAttrList()
    },
    // 一上来触发
    // 从添加属性组件切换回来时会触发
    { immediate: true },
  );


  // 计算保存按钮是否是禁用
  const isSaveDisabled = computed(() => {
    const {attrName, attrValueList} = attr
    const hasName = !!attrName
    const hasValue = attrValueList.some(attrValue => attrValue.valueName)
    return !hasName || !hasValue
  })

  /* 
  获取属性列表显示
  */
  const getAttrList = async () => {
    loading.value = true;
    attrList.value = await getAttrListApi({
      category1Id: categoryStore.category1Id as number,
      category2Id: categoryStore.category2Id as number,
      category3Id: categoryStore.category3Id as number,
    });
    loading.value = false;
  }

  /**
   * 删除属性
   * @param id 
   */
  const remove = async (id: number) => {
    await deleteAttrApi(id)
    ElMessage.success('删除成功')
    getAttrList()
  }

  /* 
  保存要添加或更新的属性
  */
  const save = async () => {
    // 添加必要的属性
    attr.categoryId = categoryStore.category3Id as number

    // 对要提交的数据进行特定处理/整理操作(开发经常做)
    // 处理1: 过滤掉没有属性值名称的属性值对象
    // 处理2: 删除属性值对象中的edit属性
    attr.attrValueList = attr.attrValueList.filter(value => {
      if (value.valueName) {
        delete value.isShowEdit
        return true
      }
      return false
    })

    // 发请求
    await addOrUpdateAttrApi(attr)
    // 提示
    ElMessage.success('保存成功')
    // 回到列表页面
    isShowAttrList.value = true
    // 重新获取列表显示
    getAttrList()
  }

  /**
   * 添加一个属性值
   */
  const addValue = () => {
    // 向attr.attrValueList中添加一个属性值对象:
    attr.attrValueList.push({
      valueName: '',
      attrId: attr.id,
      isShowEdit: true
    })
    // 自动获取焦点:
    nextTick(() => {
      inputsRef.value[attr.attrValueList.length-1].focus()
    })
  }

  /**
   * 显示文本
   * @param row 属性值对象
   * @param index 下标
   */
  const showSpan = (row: AttrValueModel, index: number) => {
    // 如果没有输入, 删除这条数据
    if (!row.valueName) {
      attr.attrValueList.splice(index, 1);
      return
    }
    // 变为查看模式
    row.isShowEdit = false
  }

  /**
   * 显示输入框
   * @param row  属性值对象
   * @param index 下标
   */
  const showInput = (row: AttrValueModel, index: number) => {
    // 显示输入框
    row.isShowEdit = true

    // 显示输入框后, 自动获取焦点
    nextTick(() => {
      inputsRef.value[index].focus()
    })
  }

  /**
   * 显示添加界面
   */
  const showAdd = () => {
    // 重置attr
    Object.assign(attr, {
      attrName: '',
      attrValueList: [],
      categoryId: categoryStore.category3Id as number,
      categoryLevel: 3
    })

    // 显示添加界面
    isShowAttrList.value = false
  }
  
  /**
   * 显示更新界面
   * @param row 属性对象
   */
  const showUpdate = (row: AttrModel) => {
    // 保存要更新的attr
    Object.assign(attr, cloneDeep(row))
    // 显示更新界面
    isShowAttrList.value = false
  }
</script>
