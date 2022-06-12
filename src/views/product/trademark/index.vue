<template>
  <el-card shadow="hover">
    <template #header>
      <el-button type="primary" :icon="Plus" @click="showAdd">添加</el-button>
    </template>

    <el-table v-loading="loading" :data="trademarkList" row-key="id" border>
      <el-table-column label="序号" type="index" width="80" align="center" />

      <el-table-column prop="tmName" label="品牌名称" />

      <el-table-column label="品牌LOGO">
        <template v-slot="scope">
          <el-image :src="scope.row.logoUrl" style="width: 100px; height:60px;" />
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template v-slot="{row, $index}">
          <el-button title="修改" type="warning" size="small" :icon="Edit" @click="showUpdate(row)"></el-button>
          <el-button title="删除" type="danger" size="small" :icon="Delete" @click="remove(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination style="margin-top: 20px; text-align: center;" 
      v-model:currentPage="current"
      v-model:page-size="pageSize" 
      :page-sizes="[3, 6, 9]" 
      :total="total" 
      layout="prev, pager, next, jumper, ->, sizes, total" 
      @current-change="val => getTrademarkList(val, pageSize)"
      @size-change="val => getTrademarkList(1, val)" />

    <el-dialog :title="trademark.id ? '修改品牌' : '添加品牌'" v-model="visible" draggable>
      <el-form :model="trademark" :rules="rules" ref="formRef" style="width: 80%" label-width="100px">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademark.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <!-- 
            show-file-list: 指定是否显示上传图片的列表, 如果是false, 只显示一张
            action: 处理上传图片请求的地址  ==> 通过代理解决跨域的问题
            on-success: 用来指定上传成功时的回调函数
            before-upload: 在准备发上传请求前调用, 如果返回false不发请求, 用来检查文件类型和大小
          -->
          <el-upload class="avatar-uploader" 
            :action="`${BASE_URL}/admin/product/fileUpload`" 
            :show-file-list="false"
            :on-success="handleAvatarSuccess" 
            :before-upload="beforeAvatarUpload">
            
            <el-icon v-if="uploadLoading" class="avatar-uploader-icon">
              <Loading />
            </el-icon>
            <img v-else-if="trademark.logoUrl" :src="trademark.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>

            <template #tip>
              <div class="el-upload__tip">只能上传jpg/png文件，且不超过50kb</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="addOrUpdate">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts" setup>

import { reactive, ref, onMounted, nextTick } from 'vue'
import {
  getTrademarkListApi,
  saveTrademarkApi,
  deleteTrademarkApi,
  updateTrademarkApi,
} from '@/api/product/trademark';
import type { TrademarkListModel, TrademarkModel } from '@/api/product/model/trademarkModel'
import type { UploadProps } from 'element-plus'
import { ElMessage, ElMessageBox } from "element-plus"
import {Loading, Plus, Edit, Delete} from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

// 上传图片地址：从.env.development中加载的
const BASE_URL = import.meta.env.VITE_API_URL;

// 品牌列表数据
const trademarkList = ref<TrademarkListModel>([]);
// table是否loading
const loading = ref<boolean>(false);
// 当前页码
const current = ref<number>(1);
// 每页条数
const pageSize = ref<number>(3);
// 总数
const total = ref<number>(0);

// 对话框
const visible = ref<boolean>(false);
// 收集的数据表单的品牌对象
let trademark = reactive<TrademarkModel>({
  tmName: '', // 品牌名称
  logoUrl: '', // 图片地址
});

// 用于存储form对象的ref => 用于表单统一校验
const formRef = ref<FormInstance>();
/**
 * 自定义校验
 * @param rule 
 * @param value 
 * @param callback 
 */
const validateTmName = (rule: any, value: any, callback: any) => {
  if (value.length<2 || value.length>10) {
    // callback(new Error('长度必须在2-10个之间'))
    callback('长度必须在2-10个之间2')  // 不通过
  } else {
    callback() // 通过
  }
}
// 校验规则
const rules: FormRules = {
  tmName: [{
      required: true,
      message: '请输入名称',
      // trigger: 'change'  // 默认就是change, 也就是输入过程中触发检查
    },
    // 使用内置校验规则实现
    /* 
    {
      min: 2,
      max: 10,
      message: '长度必须在2-10个之间',
      trigger: 'blur' // 触发校验的时机是失去焦点
    } */
    // 使用自定义验证
    {
      validator: validateTmName,
      trigger: 'blur' // 触发校验的时机是失去焦点
    }
  ],
  logoUrl: [{
    required: true,
    message: 'LOGO必须指定',
  }],
}




// 初始化获取分页列表显示
onMounted(() => {
  getTrademarkList();
});

/**
 * 获取品牌分页列表
 * @param page 页码
 * @param limit 每页数量
 */
const getTrademarkList = async (page: number=current.value, limit: number=pageSize.value) => {
  loading.value = true;
 
  const result = await getTrademarkListApi(page, limit);
  
  loading.value = false;
  current.value = page;
  pageSize.value = limit;
  total.value = result.total;
  trademarkList.value = result.records;
  
  ElMessage.success('获取品牌分页列表成功');
};

/**
 * 显示添加界面
 */
const showAdd = () => {
  // 清除/重置form中的数据
  trademark.id = undefined
  trademark.tmName = ''
  trademark.logoUrl = ''

  // 显示dialog
  visible.value = true

  // 在显示了提示信息后, 立即清除提示信息
  // 此时dialog界面还没有显示 ==> 必须延迟到界面更新显示后再执行
  nextTick(() => {// 回调函数是迟延到界面更新后执行的   面试说
    formRef.value?.clearValidate()
  })
}

/**
 * 显示更新界面
 * @param row 品牌对象
 */
const showUpdate = (row: TrademarkModel) => {
  // 保存要修改的品牌
  // const {id, tmName, logoUrl} = row
  // trademark.id = id
  // trademark.tmName = tmName
  // trademark.logoUrl = logoUrl
  Object.assign(trademark, row)

  // 显示dialog
  visible.value = true
}

/**
 * 删除品牌
 * @param row 品牌对象
 */
const remove = (row: TrademarkModel) => {
  ElMessageBox.confirm(`确定删除 ${row.tmName} 吗?`, '提示', {
    type: 'warning'
  }).then(async () => { // 点击确定的回调
    // 发删除品牌的请求
    await deleteTrademarkApi(row.id as number)
    // 如果成功了, 提示成功, 重新获取列表(哪一页?)
    ElMessage({
      type: 'success',
      message: '删除成功!'
    })

    // 哪一页?  显示上一页(当前页的列表数据只剩下1个)  否则显示当前页 
    // 如果当前是第1页且只剩下1条数据 ==> 请求第1页数据(当前页)
    if (trademarkList.value.length === 1 && current.value > 1) {
      current.value -= 1
    }
    getTrademarkList()
  }).catch((error) => { // 点击取消的回调
    if (error==='cancel') {
      ElMessage({
        type: 'info',
        message: '已取消删除'
      })
    }
  })
}

/**
 * 添加或更新品牌
 */
const addOrUpdate = () => {
  // 对所有表单项进行统一校验
  return formRef.value?.validate(async valid => { // 校验完成的回调
    // 如果通过, 才进行后面请求的操作
    if (valid) {
      let result
      // 提交请求
      if (trademark.id) { // 更新
        result = await updateTrademarkApi(trademark)
      } else { // 添加
        result = await saveTrademarkApi(trademark.tmName, trademark.logoUrl)
      }
      // 如果成功, 提示成功, 并获取新的列表显示
      ElMessage.success('保存成功!')
      // 关闭当前dialog
      visible.value = false
      // 重新获取列表显示()
      // 哪一页?  更新显示当前页, 添加显示第一页
      getTrademarkList(trademark.id? current.value : 1)
    } else { // 可以不用写
      console.log('校验不通过')
    }
  }).then(
    
  )
}

// 是否正在上传图中
const uploadLoading = ref<boolean>(false);
/* 
上传成功时的回调函数
res: 上传请求返回的响应体数据对象  {code: 200, data: 图片url}
*/
const handleAvatarSuccess: UploadProps['onSuccess'] = (res, file) => {
  // console.log('handleAvatarSuccess()', res)
  // 保存请求返回的图片url数据
  trademark.logoUrl = res.data
  console.log(res.data, '====')
  uploadLoading.value = false
  // 对logoUrl进行表单校验
  formRef.value?.validateField('logoUrl')
  // formRef.value?.clearValidate('logoUrl')
}

/* 
在准备发上传请求前调用, 如果返回false不发请求, 用来检查文件类型和大小
对图片的要求: 
  类型: jpg/png  ===> image/jpeg | image/png
  大小: <50K
*/
const beforeAvatarUpload: UploadProps['beforeUpload'] = (file) => {
  // const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'   // 利用数组来判断
  const isJPGOrPNG = ['image/jpeg', 'image/png'].indexOf(file.type) >= 0
  const isLt50K = file.size / 1024 < 50

  if (!isJPGOrPNG) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!');
    return false
  }
  if (!isLt50K) {
    ElMessage.error('上传头像图片大小不能超过 50K!');
    return false
  }

  uploadLoading.value = true

  return true
}

</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
