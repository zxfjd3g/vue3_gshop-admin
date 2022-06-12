<template>
  <div>
    <el-form inline>
      <el-form-item>
        <el-input v-model="roleNames.roleName" placeholder="角色名称"/>
      </el-form-item>

      <el-button type="primary" :icon="Search" @click="search">查询</el-button>
      <el-button @click="resetSearch">清空</el-button>
    </el-form>

    <div style="margin: 20px 0">
      <el-button type="primary"  @click="addRole" >添加</el-button>
      <el-button type="danger" @click="removeRoles" :disabled="selectedRoles.length === 0">批量删除</el-button>
    </div>

    <el-table
      border
      stripe
      style="width: 960px"
      v-loading="listLoading"
      :data="roles"
      @selection-change="handleSelectionChange">

      <el-table-column
        type="selection"
        width="55" />

      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center">
      </el-table-column>

      <el-table-column label="角色名称">
        <template v-slot="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.roleName" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              :icon="Refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              取消
            </el-button>
          </template>
          <span v-else>{{ row.roleName }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" width="300" align="center">
        <template v-slot="{row}">
          <el-button size="small" type="info" :icon="InfoFilled" title="分配权限"
            @click="$router.push(`/acl/role/auth?id=${row.id}&roleName=${row.roleName}`)"/>

          <el-button size="small" type="primary" :icon="Check" title="确定" 
            @click="updateRole(row)"/>
          <el-button size="small" type="primary" :icon="Edit" title="修改角色" 
            @click="row.edit= true" />
          <el-button size="small" type="danger" :icon="Delete" title="删除角色"
            @click="removeRole(row)"/>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30]"
      style="padding: 20px 0;"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getRoles"
      @size-change="getRoles(1, $event)"
    />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'Role',
  };
</script>

<script lang="ts" setup>
  import {ref, reactive, onMounted} from 'vue'
  import {ElForm, ElFormItem, ElInput, ElButton, ElTable, ElTableColumn, ElPagination, ElMessage, ElMessageBox} from 'element-plus'
  import {Search, Edit, Delete, Refresh, InfoFilled, Check} from '@element-plus/icons-vue'
  import type { RoleListModel, RoleModel } from '@/api/acl/model/roleModel';
  import { updateRoleApi, removeRoleApi, getRoleListApi, saveRoleApi, removeRolesApi } from '@/api/acl/role';

  const listLoading = ref(false) // 数据是否正在加载
  const roles = ref<RoleListModel>([]) // 角色列表
  const total = ref(0) // 总记录数
  const page = ref(1) // 当前页码
  const limit = ref(5) // 每页记录数
  const roleNames = reactive({ // 用户搜索的用户名
    roleName: '',
    searchRoleName: ''
  })
  const selectedRoles = ref<RoleListModel>([]) // 所有选中的角色列表

  onMounted(() => {
    getRoles()
  })

  /* 
  取消修改
  */
  const cancelEdit = (role: RoleModel) => {
    role.roleName = role.originRoleName as string
    role.edit = false
    ElMessage.warning('取消角色修改')
  }

  /* 
  更新角色
  */
  const updateRole = (role: RoleModel) => {
    updateRoleApi(role)
      .then(() => {
        ElMessage.success('更新角色成功!')
        getRoles()
      })
  }


  /* 
  添加角色
  */
  const addRole = () => {
    // 显示添加界面
    ElMessageBox.prompt('请输入新名称', '添加角色', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(({ value }) => {
      saveRoleApi({roleName: value})
      .then(() => {
        ElMessage.success('添加角色成功')
        getRoles()
      })
    }).catch(() => {
      ElMessage.warning('取消添加')
    })
  }

  /* 
  异步获取角色分页列表
  */
  const getRoles = (p=page.value, size=limit.value) => {
    page.value = p
    limit.value = size
    listLoading.value = true
    getRoleListApi(p, size, roleNames.searchRoleName).then(
      result => {
        roles.value = result.items.map(item => {
          item.edit = false // 用于标识是否显示编辑输入框的属性
          item.originRoleName = item.roleName // 缓存角色名称, 用于取消
          return item
        })
        total.value = result.total
      }
    ).finally(() => {
      listLoading.value = false
    })
  }

  /* 
  根据搜索条件进行搜索
  */
  const search = () => {
    roleNames.searchRoleName = roleNames.roleName
    getRoles()
  }

  /* 
  重置查询表单搜索列表
  */
  const resetSearch = () => {
    roleNames.roleName = ''
    roleNames.searchRoleName = ''
    getRoles()
  }

  /* 
  删除指定的角色
  */
  const removeRole = (role: RoleModel) => {
    ElMessageBox.confirm(`确定删除 '${role.roleName}' 吗?`, '提示', {
      type: 'warning'
    }).then(async () => {
      await removeRoleApi(role.id as string)
      getRoles(roles.value.length===1 ? page.value-1 : page.value)
      ElMessage.success('删除成功!')
    }).catch(() => {
      ElMessage.info('已取消删除')
    })
  }

  /* 
  当表格复选框选项发生变化的时候触发
  */
  const handleSelectionChange = (selection: RoleListModel) => {
    selectedRoles.value = selection
  }

  /* 
  批量删除
  */
  const removeRoles = () => {
    ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', '提示', {
      type: 'warning'
    }).then(async () => {
      const ids = selectedRoles.value.map(role => role.id as string)
      await removeRolesApi(ids)
      getRoles()
      ElMessage({
        type: 'success',
        message: '批量删除成功!'
      })
    }).catch((error) => {
      if (error==="cancel") {
        ElMessage({
          type: 'info',
          message: '已取消删除'
        })
      }
    })
  }
</script>
