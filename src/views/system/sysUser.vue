<template>
  <!---Search form-->
  <div class="search-div">
    <el-form label-width="70px" size="small">
      <el-row>
        <el-col :span="12">
          <el-form-item label="keyword">
            <el-input
              v-model="queryDto.keyword"
              style="width: 100%"
              placeholder="username"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="createTime">
            <el-date-picker
              v-model="createTimes"
              type="daterange"
              range-separator="To"
              start-placeholder="startTime"
              end-placeholder="endTime"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display:flex">
        <el-button type="primary" size="small" @click="searchSysUser">
          Search
        </el-button>
        <el-button size="small" @click="resetData">Reset</el-button>
      </el-row>
    </el-form>
  </div>

  <!--'Add' button-->
  <div class="tools-div">
    <el-button type="success" size="small" @click="addShow">Add</el-button>
  </div>

  <el-dialog v-model="dialogVisible" title="Add or modify" width="40%">
    <el-form label-width="120px">
      <el-form-item label="username">
        <el-input v-model="sysUser.userName" />
      </el-form-item>
      <el-form-item v-if="sysUser.id == null" label="password">
        <el-input type="password" show-password v-model="sysUser.password" />
      </el-form-item>
      <el-form-item label="name">
        <el-input v-model="sysUser.name" />
      </el-form-item>
      <el-form-item label="phone">
        <el-input v-model="sysUser.phone" />
      </el-form-item>
      <el-form-item label="avatar">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8501/admin/system/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :headers="headers"
        >
          <img v-if="sysUser.avatar" :src="sysUser.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="descripton">
        <el-input v-model="sysUser.description" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">Submit</el-button>
        <el-button @click="dialogVisible = false">Cancel</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <!---Data form-->
  <el-table :data="list" style="width: 100%">
    <el-table-column prop="userName" label="username" />
    <el-table-column prop="name" label="name" />
    <el-table-column prop="phone" label="phone" />
    <el-table-column prop="avatar" label="avatar" #default="scope">
      <img :src="scope.row.avatar" width="50" />
    </el-table-column>
    <el-table-column prop="description" label="description" />
    <el-table-column prop="status" label="status" #default="scope">
      {{ scope.row.status == 1 ? 'Normal' : 'Disabled' }}
    </el-table-column>
    <el-table-column prop="createTime" label="createTime" />
    <el-table-column label="Operation" align="center" width="280" #default="scope">
      <el-button type="primary" size="small" @click="editSysUser(scope.row)">
        Edit
      </el-button>
      <el-button type="danger" size="small" @click="deleteById(scope.row)">
        Delete
      </el-button>
      <el-button type="warning" size="small" @click="showAssignRole(scope.row)">
        Assign Roles
      </el-button>
      <el-dialog v-model="dialogRoleVisible" title="AssignRoles" width="40%">
        <el-form label-width="80px">
          <el-form-item label="username">
            <el-input disabled :value="sysUser.userName"></el-input>
          </el-form-item>

          <el-form-item label="RoleList">
            <el-checkbox-group v-model="userRoleIds">
              <el-checkbox
                v-for="role in allRoles"
                :key="role.id"
                :label="role.id"
              >
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="doAssign">Submit</el-button>
            <el-button @click="dialogRoleVisible = false">Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-table-column>
  </el-table>

  <el-pagination
    v-model:current-page="pageParams.page"
    v-model:page-size="pageParams.limit"
    :page-sizes="[10, 20, 50, 100]"
    @size-change="fetchData"
    @current-change="fetchData"
    layout="total, sizes, prev, pager, next"
    :total="total"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  GetSysUserListByPage,
  SaveSysUser,
  UpdateSysUser,
  DeleteSysUser,
  DoAssignRoleToUser,
} from '@/api/sysUser'
import { ElMessage, ElMessageBox } from 'element-plus'
import { GetAllRoleList } from '@/api/sysRole'

//=============== Assign roles to users
const userRoleIds = ref([])
const allRoles = ref([
  { id: 1, roleName: 'Administrator' },
  { id: 2, roleName: 'Business personnel' },
  { id: 3, roleName: 'Product input personnel' },
])
const dialogRoleVisible = ref(false)
const showAssignRole = async row => {
  sysUser.value = { ...row }
  dialogRoleVisible.value = true

  const { data } = await GetAllRoleList(row.id)
  allRoles.value = data.allRolesList

  userRoleIds.value = data.sysUserRoles
}
// assign role
const doAssign = async () => {
  let assignRoleVo = {
    userId: sysUser.value.id,
    roleIdList: userRoleIds.value,
  }
  const { code } = await DoAssignRoleToUser(assignRoleVo)
  if (code === 200) {
    ElMessage.success('Operation Success')
    dialogRoleVisible.value = false
    fetchData()
  }
}

//=============== Avatar Upload
import { useApp } from '@/pinia/modules/app'

const headers = {
  token: useApp().authorization.token, // Retrieve the token from 'Pinia' folder and set it in the request header during file upload.
}

// Event handling function after successful image upload
const handleAvatarSuccess = (response, uploadFile) => {
  sysUser.value.avatar = response.data
}

//=============== User deletion
const deleteById = row => {
  ElMessageBox.confirm('This action will permanently delete the record. Are you sure you want to continue?', 'Warning', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning',
  }).then(async () => {
    const { code } = await DeleteSysUser(row.id)
    if (code === 200) {
      ElMessage.success('Deletion Success')
      fetchData()
    }
  })
}

//=============== User creation and update
const dialogVisible = ref(false)

const form = {
  userName: '',
  name: '',
  phone: '',
  password: '',
  description: '',
  avatar: '',
}
const sysUser = ref({ form })

// click on 'update' pop up dialog box, data display
const editSysUser = row => {
  sysUser.value = { ...row }
  dialogVisible.value = true
}

// click on 'create' pop up dialog box
const addShow = () => {
  sysUser.value = {}
  dialogVisible.value = true
}
// submission method
const submit = async () => {
  if (!sysUser.value.id) {
    // no id => create, id exists => update
    const { code } = await SaveSysUser(sysUser.value)
    if (code === 200) {
      dialogVisible.value = false
      ElMessage.success('Operation Success')
      fetchData()
    }
  } else {
    // update
    const { code } = await UpdateSysUser(sysUser.value)
    if (code === 200) {
      dialogVisible.value = false
      ElMessage.success('Operation Success')
      fetchData()
    }
  }
}

//=============== User List
// Table data model
const list = ref([])

// Pagination bar data model
const total = ref(0)

// paging
const pageParamsForm = {
  page: 1, // current page
  limit: 3,
}
const pageParams = ref(pageParamsForm)

const createTimes = ref([])

// encapsulate data model
const queryDto = ref({
  keyword: '',
  createTimeBegin: '',
  createTimeEnd: '',
})

//
onMounted(() => {
  fetchData()
})

// axios
const fetchData = async () => {
  // Retrieve start and end times
  if (createTimes.value.length == 2) {
    queryDto.value.createTimeBegin = createTimes.value[0]
    queryDto.value.createTimeEnd = createTimes.value[1]
  }
  const { code, message, data } = await GetSysUserListByPage(
    pageParams.value.page,
    pageParams.value.limit,
    queryDto.value
  )
  list.value = data.list
  total.value = data.total
}

// search
const searchSysUser = () => {
  fetchData()
}
</script>

<style scoped>
.search-div {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
.tools-div {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
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
