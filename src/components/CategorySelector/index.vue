<template>
  <el-form inline>
    <el-form-item label="一级分类">
      <el-select v-model="category1Id" :disabled="props.disabled">
        <el-option v-for="item in categoryStore.category1List" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select v-model="category2Id" :disabled="props.disabled">
        <el-option v-for="item in categoryStore.category2List" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select v-model="categoryStore.category3Id" :disabled="props.disabled">
        <el-option v-for="item in categoryStore.category3List" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
  import {ElForm, ElFormItem, ElSelect, ElOption} from 'element-plus'
  import { onMounted, computed } from 'vue'
  import { useCategoryStore } from '@/stores/category';

  // 定义接收的属性
  const props = defineProps({
    disabled: {
      default: false,
      type: Boolean
    }
  })

  // 组件使用pinia中的分类数据
  const categoryStore = useCategoryStore();

  // 定义一级分类ID的getter/setter
  const category1Id = computed<number>({
    get() {
      return categoryStore.getCategory1Id as number;
    },
    async set(val) {
      categoryStore.setCategory2List(val)
    },
  });

  // 定义二级分类ID的getter/setter
  const category2Id = computed<number>({
    get() {
      return categoryStore.getCategory2Id as number;
    },
    async set(val) {
      categoryStore.setCategory3List(val);
    },
  });

  // 初始化获取一级分类列表显示
  onMounted(async () => {
    categoryStore.setCategory1List()
  });

</script>
