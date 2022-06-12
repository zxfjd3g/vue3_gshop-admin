<template>
  <div>
    <el-card style="margin-bottom: 10px">
      <category-selector :disabled="showStatus !== ShowStatus.SPU_LIST"></category-selector>
    </el-card>

    <el-card>
      <!-- 列表页面 -->
      <SpuList 
        v-if="showStatus===ShowStatus.SPU_LIST" 
        @setShowStatus="setShowStatus"
        @setCurrentSpu="setCurrentSpu"
      />
     
     <!-- 组件标签对象就是组件对象 -->
      <SpuForm
        v-else-if="showStatus===ShowStatus.ADD_SPU"
        @setShowStatus="setShowStatus"
        :currentSpu="currentSpu"/>
      
      <SkuForm
        v-else="showStatus===ShowStatus.ADD_SKU"
        @setShowStatus="setShowStatus"
        :spu="{ id: currentSpu.id as number, spuName: currentSpu.spuName }"/>
    </el-card>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'SpuList',
  };
</script>

<script lang="ts" setup>
  import { ElCard } from 'element-plus';
  import CategorySelector from '@/components/CategorySelector/index.vue'
  import SpuList from "./components/SpuList.vue";
  import SkuForm from './components/SkuForm.vue'
  import SpuForm from './components/SpuForm.vue'
  import type { SpuModel } from '@/api/product/model/spuModel';
  import {ref} from 'vue'
  import { ShowStatus } from './types';

  const showStatus = ref<ShowStatus>(ShowStatus.SPU_LIST)
  
  const initSpuModel = () => ({
    spuName: '',
    description: '',
    tmId: undefined,
    spuSaleAttrList: [],
    spuImageList: [],
  })
  const currentSpu = ref<SpuModel>(initSpuModel())

  const setShowStatus = (status: ShowStatus) => {
    showStatus.value = status
  }

  const setCurrentSpu = (val: SpuModel=initSpuModel()) => {
    currentSpu.value = val
  }
</script>
