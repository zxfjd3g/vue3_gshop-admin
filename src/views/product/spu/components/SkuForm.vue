<template>
  <el-form ref="formRef" :rules="rules" :model="skuInfo" label-width="120px">
    <el-form-item label="SPU 名称">{{props.spu.spuName}}</el-form-item>
    <el-form-item label="SKU 名称" prop="skuName">
      <el-input placeholder="SKU 名称" v-model="skuInfo.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)" prop="price">
      <el-input type="number" placeholder="价格" v-model="skuInfo.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(千克)" prop="weight">
      <el-input type="number" placeholder="重量" v-model="skuInfo.weight"></el-input>
    </el-form-item>
    <el-form-item label="规格描述" prop="skuDesc">
      <el-input type="textarea" placeholder="规格描述" rows="4" v-model="skuInfo.skuDesc"></el-input>
    </el-form-item>
    
    <el-form-item label="平台属性" prop="skuAttrValueList">
      <el-form inline label-width="100px">
        <el-form-item style="margin-bottom: 10px" :label="attr.attrName" v-for="(attr, index) in attrList" :key="attr.id">
          <el-select v-model="skuInfo.skuAttrValueList[index]" >
            <el-option v-for="value in attr.attrValueList" :key="value.id" 
              :label="value.valueName" :value="value.id +':' + attr.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="销售属性" prop="skuSaleAttrValueList">
      <el-form inline label-width="100px">
        <el-form-item :label="attr.saleAttrName" v-for="(attr, index) in spuSaleAttrList" :key="attr.id">
          <el-select v-model="skuInfo.skuSaleAttrValueList[index]">
            <el-option :label="value.saleAttrValueName" :value="value.id||''" v-for="value in attr.spuSaleAttrValueList" :key="value.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="图片列表" prop="skuImageList">
      <el-table
        :data="spuImageList"
        @selection-change="handleSelectionChange"
        border>
        <el-table-column
        type="selection"
        width="55"/>
        <el-table-column
          label="图片" >
          <template v-slot="{row}">
            <el-image
              style="width: 100px; height: 100px"
              :src="row.imgUrl"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="imgName"
          label="名称" >
        </el-table-column>
        <el-table-column
          label="操作" >
          <template v-slot="{row}">
            <el-tag v-if="row.isDefault==='1'" type="success">默认</el-tag>
            <el-button @click="setDefault(row)" v-else type="primary" size="small">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item prop="skuDefaultImg">

    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="emits('setShowStatus', ShowStatus.SPU_LIST)">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
  export default {
    name: 'AddOrUpdateSku',
  }
</script>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
  import {
    ElForm,
    ElFormItem,
    ElInput,
    ElSelect,
    ElOption,
    ElTable,
    ElTableColumn,
    ElButton,
    ElMessage,
  } from 'element-plus'
  import type { FormRules, FormInstance} from 'element-plus'
  import type { AttrListModel } from '@/api/product/model/attrModel';
  import { getAttrListApi } from '@/api/product/attr';
  import { getSpuImageListApi, getSpuSaleAttrListApi } from '@/api/product/spu';
  import { saveSkuApi } from '@/api/product/sku';
  import type { SpuImageListModel, SpuImageModel, SpuSaleAttrListModel } from '@/api/product/model/spuModel';
  import { ShowStatus } from '../types';
  import { useCategoryStore } from '@/stores/category';

  const formRef = ref<FormInstance>()
  const spuSaleAttrList = ref<SpuSaleAttrListModel>([])
  const attrList = ref<AttrListModel>([])
  const spuImageList = ref<SpuImageListModel>([]) // 用于显示的图片列表

  // 定义事件
  const emits = defineEmits(['setShowStatus']);
  // 定义props
  const props = defineProps<{
    spu: {
      id: number;
      spuName: string;
    };
  }>();

  const categoryStore = useCategoryStore();

  // 校验规则
  const rules: FormRules = {
    skuName: [{ required: true, message: '请输入SKU名称', trigger: 'blur' }],
    price: [{ required: true, message: '请输入SKU价格' }],
    weight: [{ required: true, message: '请输入SKU重量' }],
    skuDesc: [{ required: true, message: '请输入SKU描述', trigger: 'blur' }],
    skuAttrValueList: [{ required: true, message: '请选择平台属性', type: 'array' }],
    skuSaleAttrValueList: [{ required: true, message: '请选择销售属性', type: 'array' }],
    skuImageList: [{ required: true, message: '请选择SKU图片', type: 'array' }],
    skuDefaultImg: [{ required: true, message: '请选择默认图片'}],
  }

  /* 
  1. 根据spuId获取Spu销售属性列表: sku.getSpuSaleAttrList(spuId)
  2. 根据3级分类id获取平台属性列表: attr.getList(category1Id, category2Id, category3Id)
  3. 根据spuId获取Spu图片列表: sku.getSpuImageList(spuId)
  */
  onMounted(async () => {
    attrList.value = await getAttrListApi({
      category1Id: categoryStore.getCategory1Id as number,
      category2Id: categoryStore.getCategory2Id as number,
      category3Id: categoryStore.getCategory3Id as number,
    });
  });
  onMounted(async () => {
    spuImageList.value = await getSpuImageListApi(props.spu.id);
  });
  onMounted(async () => {
    spuSaleAttrList.value = await getSpuSaleAttrListApi(props.spu.id);
  });

  // 生成初始化skuInfo数据
  const skuInfo = reactive({
    skuName: '',
    price: 0,
    weight: 0,
    skuDesc: '',
    tmId: undefined,
    // 平台属性
    skuAttrValueList: [
      // {
      //   attrId: 0,
      //   attrName: 'string',
      //   valueId: 0,
      //   valueName: 'string',
      // },
    ],
    skuSaleAttrValueList: [
      // {
      //   saleAttrId: 0,
      //   saleAttrName: 'string',
      //   saleAttrValueId: 0,
      //   saleAttrValueName: 'string',
      //   spuId: 0,
      // },
    ],
    // 默认图片
    skuDefaultImg: '',
    skuImageList: [
      // {
      //   imgName: 'string',
      //   imgUrl: 'string',
      //   isDefault: 'string',
      //   spuImgId: 0,
      //   isDefault: "1"
      // },
    ],
    // spuId: 0,
  })

  /* 
  保存sku
  */
  const save = async () => {

    await formRef.value?.validate()
    
    // 发请求
    await saveSkuApi({
      ...skuInfo,
      spuId: props.spu.id,
      category3Id: categoryStore.category3Id as number,
      skuAttrValueList: skuInfo.skuAttrValueList.filter(Boolean).map((valueIdAttrId: string) => {
        const [valueId, attrId] = valueIdAttrId.split(':')
        return {
          attrId: +attrId,
          valueId: +valueId
        }
      }),
      skuSaleAttrValueList: skuInfo.skuSaleAttrValueList.filter(Boolean).map((saleAttrValueId: string) => {
        return {
          saleAttrValueId: +saleAttrValueId
        }
      }),
      skuImageList: skuInfo.skuImageList.map((item: SpuImageModel) => ({
        imgName: item.imgName,
        imgUrl: item.imgUrl,
        spuImgId: item.id as number,
        isDefault: item.isDefault as string
      }))
    })

    // 提示
    ElMessage.success('保存SKU成功')
    
    // 跳转到列表页面
    emits('setShowStatus', ShowStatus.SPU_LIST);
  }

  /* 
  选中状态发生了改变
  val: 所有选中行的数据对象的列表
  */
  const handleSelectionChange = (val: any) => {
    skuInfo.skuImageList = val
  }

  /* 
  将指定的图片指定为默认的
  */
  const setDefault = (row: SpuImageModel) => {
    // 将所有都变为非默认的
    // forEach遍历是不能中断的, 要想中断遍历, 得用for/while循环
    spuImageList.value.forEach(item => {
      item.isDefault = '0'
    })
    
    // 将当前的变为默认的
    row.isDefault = '1'

    // 收集默认图片
    skuInfo.skuDefaultImg = row.imgUrl
  }
</script>

<style scoped>

</style>
