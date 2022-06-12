<template>
  <el-form ref="formRef" :model="spuInfo" :rules="rules" label-width="120px" action="/xxx" @submit.prevent>
    <el-form-item label="SPU名称" prop="spuName">
      <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
    </el-form-item>
    <el-form-item label="品牌" prop="tmId">
      <el-select v-model="spuInfo.tmId">
        <el-option v-for="tm in trademarkList" :key="tm.id" :label="tm.tmName" :value="(tm.id||0)"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述" prop="description">
      <el-input type="textarea" placeholder="SPU描述" rows="4" v-model="spuInfo.description"></el-input>
    </el-form-item>

    <el-form-item label="SPU图片" prop="spuImageList">
      <el-upload
        multiple
        :file-list="(spuInfo.spuImageList as any)"
        :action="`${BASE_URL}/admin/product/fileUpload`"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-success="handleSuccess"
        :on-remove="handleRemove">
        <el-icon><Plus /></el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-form-item>

    <el-form-item label="销售属性" prop="spuSaleAttrList">
      <el-select v-model="saleAttrIdName" :placeholder="saleListText">
        <el-option v-for="item in unUseSaleAttrList" :key="item.id" :label="item.name" 
          :value="item.id + ':' + item.name"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus" @click="addSpuSaleAttr">添加销售属性</el-button>
      <el-table
        style="margin: 20px 0"
        :data="spuInfo?.spuSaleAttrList"
        border>
        <el-table-column
          label="序号"
          type="index"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          label="属性名" 
          prop="saleAttrName"
          width="150">
        </el-table-column>
        <el-table-column
          label="属性值名称列表" >
          <template v-slot="{row, $index}">
            <el-tag closable  :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index, 1)" 
              style="margin-right:5px;" v-for="(item, index) in row.spuSaleAttrValueList" 
              :key="item.saleAttrValueName" type="success">{{item.saleAttrValueName}}</el-tag>

            <el-input v-model="saleAttrValueName" 
              v-if="row.isShowEdit"
              @blur="toView(row)" 
              :ref="(input: any) => {inputsRef[$index] = input}" 
              placeholder="名称"
              size="small" 
              style="width: 100px" />
            <el-button @click="toEdit(row, $index)" v-else size="small" :icon="Plus"></el-button>

          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150">
          <template v-slot="{$index}">
            <el-button @click="spuInfo?.spuSaleAttrList.splice($index, 1)" title="删除" type="danger" 
              size="small" :icon="Delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="emits('setShowStatus', ShowStatus.SPU_LIST)">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
  export default {
    name: 'SpuForm'
  }
</script>

<script lang="ts" setup>
  import {ElIcon, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElUpload, ElTable, ElTableColumn, ElTag, ElButton, ElMessage} from 'element-plus'
  import type {UploadFile, UploadFiles, FormRules, FormInstance} from 'element-plus'
  import { Plus, Delete } from '@element-plus/icons-vue'
  import {computed, nextTick, ref, reactive, onMounted} from 'vue'
  import type { BaseSaleAttrListModel, SpuModel, SpuSaleAttrModel } from '@/api/product/model/spuModel';
  import type { TrademarkListModel } from '@/api/product/model/trademarkModel';
  import { addOrUpdateSpuApi, getSpuImageListApi, getBaseSaleAttrListApi, getSpuSaleAttrListApi } from '@/api/product/spu';
  import { getAllTrademarkListApi } from '@/api/product/trademark'
  import { ShowStatus } from '../types';
  import { useCategoryStore } from '@/stores/category'

  const categoryStore = useCategoryStore();
  const emits = defineEmits(['setShowStatus'])
  const props = defineProps<{
    currentSpu: SpuModel
  }>()

  // 上传图片地址：从.env.development中加载的
  const BASE_URL = import.meta.env.VITE_API_URL;

  const dialogImageUrl = ref('')
  const dialogVisible = ref(false)
  const spuInfo = reactive<SpuModel>(props.currentSpu);
  const trademarkList = ref<TrademarkListModel>([]) // 品牌列表
  const baseSaleAttrList = ref<BaseSaleAttrListModel>([]) // 基础销售属性列表
  const saleAttrIdName = ref('') // 用于收集选择的销售属性   id:name
  
  const saleAttrValueName = ref<string>(''); // 收集用户输入的销售属性值名称

  const inputsRef = ref<HTMLInputElement[]>([])
  const formRef = ref<FormInstance>()


  // 表单验证规则
  const rules: FormRules = {
    spuName: [{ required: true, message: '请输入SPU名称', trigger: 'blur' }],
    tmId: [{ required: true, message: '请选择SPU品牌' }],
    description: [{ required: true, message: '请输入SPU描述', trigger: 'blur' }],
    spuImageList: [{ required: true, message: '请上传SPU图片', type: 'array' }],
    spuSaleAttrList: [{ required: true, message: '请添加SPU销售属性', type: 'array' }],
  };

  // 生命周期可以写多个
  onMounted(async () => {
    // 获取基础销售属性列表
    baseSaleAttrList.value = await getBaseSaleAttrListApi();
  });
  onMounted(async () => {
    // 获取所有品牌列表
    trademarkList.value = await getAllTrademarkListApi();
  });
  onMounted(async () => {
    // 如果spuInfo有id, 获取spu图片列表
    const id = spuInfo.id as number;
    if (!id) return;
    const spuImageList = await getSpuImageListApi(id);

    spuInfo.spuImageList = spuImageList.map(item => ({
      ...item,
      name: item.imgName,
      url: item.imgUrl
    }))
  });
  onMounted(async () => {
    // 如果spuInfo有id, 获取spu销售属性列表
    const id = spuInfo.id as number;
    if (!id) return;
    spuInfo.spuSaleAttrList = await getSpuSaleAttrListApi(id);
  });


  /* 
  上传图片成功的回调
  response: 响应体对象
  file: 上传成功的文件对象
  fileList: 所有已上传的文件对象的数组
  */
  const handleSuccess = (response: any, file: UploadFile, fileList: UploadFiles) => {
    console.log('handleSuccess', fileList)
    spuInfo.spuImageList = fileList as any
  }

  /* 
  删除图的回调
  file: 删除文件对象
  fileList: 剩下的已上传的文件对象的数组
  */
  const handleRemove = (file: UploadFile, fileList: UploadFiles) => {
    spuInfo.spuImageList = fileList as any
  }

  /**
   * 点击放大镜图标的回调
   * @param file 
   */
  const handlePictureCardPreview = (file: UploadFile) => {
    console.log(file)

    // 保存预览的图片url
    dialogImageUrl.value = file.url as string;
    // 显示dialog
    dialogVisible.value = true;
  }


  /* 
  用于显示下拉列表的未使用的销售属性列表
  */
  const unUseSaleAttrList = computed(() => {
    // 计算产生一个要用的数据, 并返回
    // 过滤总销售属性列表
    return baseSaleAttrList.value.filter(attr => {
      // 看attr.name有没有在spuSaleAttrList中一个对应的   name===saleAttrName
      // 如果没有, 才留下来
      return !spuInfo.spuSaleAttrList.some(item => item.saleAttrName==attr.name)
      // return spuInfo.value?.spuSaleAttrList.every(item => item.saleAttrName!=attr.name)
    })
  })

  /* 
  销售属性下拉列表的文本提示
  */
  const saleListText =  computed(() =>{
    const {length} = unUseSaleAttrList.value
    return length>0 ? `还有${length}未选择` : '没有啦!'
  })

  /* 
  添加或者更新spuInfo
  */
  const save = async () => {
    
    // 进行表单校验, 如果通过返回成功的promise
    await formRef.value?.validate()

     // 整理1: spuImageList
      /* 
      从后台获取的图片文件对象的结构
			{
			    "id": 333,
			    "spuId": 26,
			    "imgName": "rBHu8l6UcKyAfzDsAAAPN5YrVxw870.jpg",
			    "imgUrl": "http://47.93.148.192:8080/xxx.jpg",
				 "name": "rBHu8l6UcKyAfzDsAAAPN5YrVxw870.jpg",
				 "url":  "http://47.93.148.192:8080/xxx.jpg"
			}
		新上传的图片文件对象的结构
			{
				name: "e814ec6fd86c5a8c.jpg"
				response: {
					data: "http://182.92.128.115:8080/group1/xxx.jpg"
				}
				url: "blob:http://localhost:9529/a5199d82-0811-442d-9ec2-dafae83d9ed9"
			}
		提交保存/更新SPU请求的图片对象的结构(目标):
			 {
			    "imgName": "下载 (1).jpg",
			    "imgUrl": "http://47.93.148.192:8080/xxx.jpg"
			 }
      */
    spuInfo.spuImageList = spuInfo.spuImageList.map(item => ({
      imgName: item.name as string,
      imgUrl: item.response ? item.response.data : item.imgUrl
    }))

    /* 
    处理: 删除没有属性值的属性对象, 删除属性对象中的edit和valueName属性
    对spuInfo.spuSaleAttrList进行过滤(spuSaleAttrValueList是空数组) 
    */
    spuInfo.spuSaleAttrList = spuInfo.spuSaleAttrList.filter(item => {
      if (item.spuSaleAttrValueList.length>0) {
        delete item.isShowEdit
        return true
      }
      return false
    })

    // 如果一个spu的销售属性都没有了, 不发请求并提示
    if (spuInfo.spuSaleAttrList.length===0) {
      ElMessage.warning('必须SPU销售属性!')
      return
    }

    // 添加三级分类ID属性
    spuInfo.category3Id = categoryStore.getCategory3Id

    // 发保存/更新spuInfo的请求
    await addOrUpdateSpuApi(spuInfo)

    // 请求成功后, 做后续的响应处理
    ElMessage.success('保存成功!')
    // 重置/清除数据
    emits('setShowStatus', ShowStatus.SPU_LIST)
  }

  /**
   * 添加spu销售属性
   */
  const addSpuSaleAttr = () => {
    const [id, name] = saleAttrIdName.value.split(':')
    /* 
    向spuInfo.spuSaleAttrList中添加一个属性对象:
      {
          "baseSaleAttrId": "1", // 销售属性id
          "saleAttrName": "选择颜色",  // 销售属性名
          "spuSaleAttrValueList": []
        }
    */
    spuInfo.spuSaleAttrList.push({
      baseSaleAttrId: +id, // 销售属性id
      saleAttrName: name,  // 销售属性名
      spuSaleAttrValueList: []
    })
    // 清除收集的数据
    saleAttrIdName.value = ''
  }

  /**
   * 变为查看模式
   * @param saleAttr 
   */
  const toView = (saleAttr: SpuSaleAttrModel) => {

    if (saleAttrValueName.value) {
      // 添加
      saleAttr.spuSaleAttrValueList.push({
        baseSaleAttrId: saleAttr.baseSaleAttrId,
        saleAttrValueName: saleAttrValueName.value,
      })
      // 清空
      saleAttrValueName.value = '';
    }
    // 变成显示模式
    saleAttr.isShowEdit = false;
  }
 
  /**
   * 变为编辑模式
   * @param row
   * @param index
   * 
   */
  const toEdit = (row: SpuSaleAttrModel, index: number) => {
    // 显示Input
    row.isShowEdit = true
    // 在input自动获取焦点
    nextTick(() => {
      inputsRef.value[index].focus()
    })
  }

  

</script>

<style scoped>

</style>
