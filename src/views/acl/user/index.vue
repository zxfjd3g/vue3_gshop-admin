<template>
  <el-card>
    <el-form inline>
      <el-form-item>
         <el-input v-model="paramsState.username" placeholder="用户名" />
      </el-form-item>

      <el-button type="primary" :icon="Search" @click="search">查询</el-button>
      <el-button type="default" @click="resetSearch">清空</el-button>
    </el-form>

    <div style="margin: 20px 0">
      <el-button type="primary" @click="showAddUser">添 加</el-button>
      <el-button type="danger" @click="revomveUsers" :disabled="tableState.selectedIds.length===0">批量删除</el-button>
    </div>

    <el-table
      border
      stripe
      v-loading="listLoading"
      :data="tableState.users"
      @selection-change="handleSelectionChange">

      <el-table-column
        type="selection"
        width="55" />

      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      />

      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column prop="nickName" label="用户昵称" />
      <el-table-column prop="roleName" label="角色列表" width="200"/>
      
      <el-table-column prop="gmtCreate" label="创建时间" width="180"/>
      <el-table-column prop="gmtModified" label="更新时间" width="180"/>

      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template v-slot="{row}">
          <el-button type="info" size="small" :icon="UserFilled" title="分配角色"
            @click="showAssignRole(row)"/>
          <el-button type="primary" size="small" :icon="Edit" title="修改用户"
            @click="showUpdateUser(row)"/>
          <el-popconfirm :title="`确定删除 ${row.username} 吗?`" @confirm="removeUser(row.id)">
            <template #reference>
              <el-button style="margin-left:10px" type="danger" size="small" :icon="Delete" title="删除用户"/> 
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="paramsState.page"
      :page-size="paramsState.limit"
      :total="tableState.total"
      :page-sizes="[5, 10, 20, 30]"
      style="padding: 20px 0;"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getUsers"
      @size-change="getUsers(1, $event)"
    />

    <el-dialog :title="userState.user?.id ? '修改用户' : '添加用户'" 
      v-model="userState.dialogUserVisible">
      <el-form ref="userFormRef" :model="userState.user" :rules="userRules" label-width="120px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userState.user.username"/>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="userState.user.nickName"/>
        </el-form-item>
        
        <el-form-item v-if="!userState.user.id" label="用户密码" prop="password">
          <el-input v-model="userState.user.password"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button :loading="userState.userLoading" type="primary" @click="addOrUpdate">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="设置角色" v-model="roleState.dialogRoleVisible" :before-close="resetRoleData">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled :value="userState.user.username"></el-input>
        </el-form-item>

        <el-form-item label="角色列表">
          <el-checkbox :indeterminate="roleState.isIndeterminate" v-model="roleState.checkAll" 
            @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="roleState.userRoleIds" @change="handleCheckedChange">
            <el-checkbox v-for="role in roleState.allRoles" :key="role.id" :label="role.id">{{role.roleName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button :loading="roleState.roleLoading" type="primary" @click="assignRole">保存</el-button>
        <el-button @click="resetRoleData">取消</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
  export default {
    name: 'User',
  };
</script>

<script lang="ts" setup>
  import { ElCard, ElForm, ElFormItem, ElInput, ElButton, ElTable, ElTableColumn, 
    ElPopconfirm, ElPagination, ElDialog, ElCheckbox, ElCheckboxGroup, ElMessage, ElMessageBox } from 'element-plus'
  import type {FormInstance} from 'element-plus'
  import { Search, Edit, UserFilled, Delete} from '@element-plus/icons-vue'
  import { reactive, ref, onMounted, nextTick } from 'vue';
  import type { UserListModel, UserModel } from '@/api/acl/model/userModel';
  
  import type { RoleListModel } from '@/api/acl/model/roleModel';
  import { assignUserRoleListApi, getUserRoleListApi, removeUsersApi, removeUserApi, getUserListApi, saveOrUpdateUserApi } from '@/api/acl/user';

  const listLoading = ref(false) // 是否显示列表加载的提示
  const paramsState = reactive({
    username: '',
    searchUsername: '',
    page: 1, // 当前页码
    limit: 5, // 每页数量
  })

  interface TableState {
    total: number, 
    users: UserListModel, 
    selectedIds: string[]
  }
  const tableState = reactive<TableState>({
    total: 0,
    users: [],
    selectedIds: []
  })

  /* 
  自定义密码校验
  */
  const validatePassword = (rule: any, value: any, callback: any) => {
    if (!value) {
      callback('密码必须输入')
    } else if (!value || value.length < 6) {
      callback('密码不能小于6位')
    } else {
      callback()
    }
  }
  
  // 用户添加/修改表单的校验规则
  const userRules = { 
    username: [
      { required: true, message: '用户名必须输入' },
      { min: 4, message: '用户名不能小于4位' }
    ],
    password: [
      { required: true, validator: validatePassword }
    ]
  }

  interface UserState {
    dialogUserVisible: boolean
    userLoading: boolean
    user: UserModel
  }

  const userState = reactive<UserState>({
    dialogUserVisible: false,
    userLoading: false,
    user: {
      username: '',
      nickName: '',
      password: ''
    },
  })

  interface RoleState {
    dialogRoleVisible: boolean
    roleLoading: boolean
    checkAll: boolean
    isIndeterminate: boolean
    userRoleIds: string[]
    allRoles: RoleListModel
  }
  const roleState = reactive<RoleState>({
    dialogRoleVisible: false,
    roleLoading: false,
    checkAll: false,
    isIndeterminate: false,
    userRoleIds: [],
    allRoles: []
  })

  const userFormRef = ref<FormInstance>()

  onMounted(() => getUsers())

  /* 
  显示指定角色的界面
  */
  const showAssignRole = (user: UserModel) => {
    userState.user = user
    roleState.dialogRoleVisible = true
    getRoles()
  }

  /* 
  全选勾选状态发生改变的监听
  */
  const handleCheckAllChange = (value: string | number | boolean) => {// value 当前勾选状态true/false
    // 如果当前全选, userRoleIds就是所有角色id的数组, 否则是空数组
    roleState.userRoleIds = value ? roleState.allRoles.map(item => item.id as string) : []
    // 如果当前不是全选也不全不选时, 指定为false
    roleState.isIndeterminate = false
  }

  /* 
  异步获取用户的角色列表
  */
  const getRoles = async () => {
    const result = await getUserRoleListApi(userState.user?.id as string)
    const {allRolesList, assignRoles} = result
    roleState.allRoles = allRolesList
    roleState.userRoleIds = assignRoles.map(item => item.id as string)
    
    roleState.checkAll = allRolesList.length===assignRoles.length
    roleState.isIndeterminate = assignRoles.length>0 && assignRoles.length<allRolesList.length
  }

  /* 
  角色列表选中项发生改变的监听
  */
  const handleCheckedChange = () => {
    const {userRoleIds, allRoles} = roleState
    roleState.checkAll = userRoleIds.length === allRoles.length && allRoles.length>0
    roleState.isIndeterminate = userRoleIds.length>0 && userRoleIds.length<allRoles.length
  }

  /* 
  请求给用户进行角色授权
  */
  const assignRole = async  () => {
    const userId = userState.user?.id
    const roleIds = roleState.userRoleIds.join(',')
    roleState.roleLoading = true
    await assignUserRoleListApi(userId as string, roleIds)
    roleState.roleLoading = false
    ElMessage.success('分配角色成功')
    resetRoleData()

    // console.log(this.$store.getters.name, this.user)
    // if (this.$store.getters.name===this.user.username) {
    //   window.location.reload()
    // }
  }

  /* 
  重置用户角色的数据
  */
  const resetRoleData = () => {
    Object.assign(roleState, {
      dialogRoleVisible: false,
      allRoles: [],
      userRoleIds: [],
      isIndeterminate: false,
      checkAll: false
    })
  }

  /* 
  根据输入进行搜索
  */
  const search = () => {
    paramsState.searchUsername = paramsState.username
    getUsers(1)
  }

  /* 
  重置输入后搜索
  */
  const resetSearch = () => {
    paramsState.searchUsername = ''
    paramsState.username = ''
    getUsers(1)
  }

  /* 
  显示添加用户的界面
  */
  const showAddUser = () => {
    userState.user = {
      username: '',
      nickName: '',
      password: ''
    }
    userState.dialogUserVisible = true

    nextTick(() => userFormRef.value?.clearValidate())
  }

  /* 
  删除所有选中的用户
  */
  const revomveUsers = () => {
    ElMessageBox.confirm('确定删除吗?').then(async () => {
      await removeUsersApi(tableState.selectedIds)
      ElMessage.success('删除成功')
      getUsers()
    }).catch(() => {
      ElMessage.info('取消删除')
    })
  }

  /* 
  列表选中状态发生改变的监听回调
  */
  const handleSelectionChange = (selection: any[]) => {
    tableState.selectedIds = selection.map(item => item.id)
  }

  /* 
  显示更新用户的界面
  */
  const showUpdateUser = (user: UserModel) => {
    userState.user = {...user}
    userState.dialogUserVisible = true
  }

  /* 
  删除某个用户
  */
  const removeUser = async (id: string) => {
    await removeUserApi(id)
    ElMessage.success('删除成功')
    getUsers(tableState.users.length===1 ? paramsState.page-1 : paramsState.page)
  }

  /* 
  获取分页列表
  */
  const getUsers = async (page=paramsState.page, limit=paramsState.limit) => {
    paramsState.page = page
    paramsState.limit = limit
    listLoading.value = true
    const result = await getUserListApi(page, limit, {username: paramsState.searchUsername})
    listLoading.value = false
    const {items, total} = result
    tableState.users = items
    tableState.total = total
    tableState.selectedIds = []
  }

  /* 
  取消用户的保存或更新
  */
  const cancel = () => {
    userState.dialogUserVisible = false
    userState.user = {
      username: '',
      nickName: '',
      password: ''
    }
  }

  /* 
  保存或者更新用户
  */
  const addOrUpdate = async () => {
    // 进行表单校验
    await userFormRef.value?.validate()

    const {user} = userState
    if (user.username==='admin') {
      alert('admin账号不能添加或更新')
      return
    }
    userState.userLoading = true
    try {
      await saveOrUpdateUserApi(user)
      userState.userLoading = false
      ElMessage.success('保存成功!')
      getUsers(user.id ? paramsState.page : 1)
      userState.user = {
        username: '',
        nickName: '',
        password: ''
      }
      userState.dialogUserVisible = false
    } catch (error) {
      userState.userLoading = false
    }
  }

</script>
