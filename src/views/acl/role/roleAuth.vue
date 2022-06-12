<template>
  <div>
    <el-input disabled :value="$route.query.roleName"></el-input>
    <el-tree 
      style="margin: 20px 0"
      ref="treeRef"
      :data="allPermissions" 
      node-key="id"  
      show-checkbox 
      default-expand-all
      :props="defaultProps" 
    />
    <el-button :loading="loading" type="primary" @click="save">保存</el-button>
    <el-button @click="cancel">取消</el-button>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'roleAuth',
  };
</script>

<script lang="ts" setup>
  import { useRouter, useRoute } from 'vue-router'
  import { ElInput, ElTree, ElButton, ElMessage } from 'element-plus'
  import { ref, onMounted } from 'vue'
  import type { PermissionListModel } from '@/api/acl/model/permissionModel'
  import { getAssignRoleApi, assignRoleApi } from '@/api/acl/role'
  import { useUserInfoStore } from '@/stores/userInfo'

  const userInfoStore = useUserInfoStore()
  const router = useRouter()
  const route = useRoute()
  const loading = ref(false) // 用来标识是否正在保存请求中的标识, 防止重复提交
  const allPermissions = ref<PermissionListModel>([]) // 所有
  const treeRef = ref<InstanceType<typeof ElTree>>()
  const defaultProps = {
    children: 'children',
    label: 'name'
  }

  onMounted(() => init())

  /* 
  初始化
  */
  const init = () => {
    const roleId = route.query.id
    getPermissions(roleId as string)
  }

  /* 
  获取指定角色的权限列表
  */
  const getPermissions = (roleId: string) =>  {
    getAssignRoleApi(roleId).then(result => {
      allPermissions.value = result.children as PermissionListModel
      const checkedIds = getCheckedIds(allPermissions.value)
      // console.log('getPermissions() checkedIds', checkedIds)
      treeRef.value?.setCheckedKeys(checkedIds)
    })
  }

  /* 
  得到所有选中的id列表
  只用得到所有选中的按钮权限数据的id
  */
  const getCheckedIds = (auths: PermissionListModel, initArr: string[] = []) => {
    auths.forEach(item => {
      if (item.select && item.level===4) {
        initArr.push(item.id as string)
      } else if (item.children) {
        getCheckedIds(item.children, initArr)
      }
    })
    return initArr 
  }

  /* 
  保存权限列表
  */
  const save = () => {
    // 得到所有全选的id
    const checkedIds = treeRef.value?.getCheckedKeys()
    // 得到所有半选的id
    const halfCheckedIds = treeRef.value?.getHalfCheckedKeys()
    // 合并全选和半选的id， 并用逗号连接成串
    var ids = checkedIds?.concat(halfCheckedIds as []).join(",")

    loading.value = true
    assignRoleApi(route.query.id as string, ids as string).then(async () => {
      loading.value = false
      ElMessage.success('分配权限成功')
      // 跳转到角色列表页面
      await router.replace('/acl/role/list')
      // 跳转完成后, 如果分配的是当前用户角色的权限, 刷新一下浏览器
      const roleName = route.query.roleName
      if (userInfoStore.roles.includes(roleName as string)) {
        window.location.reload()
      }
    })
  }


  /* 
  取消
  */
  const cancel = () => {
    // 跳转到角色列表
    router.replace('/acl/role/list') 
  }
</script>
