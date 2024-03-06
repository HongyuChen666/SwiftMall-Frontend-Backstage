<template>
  <div class="tools-div">
    <el-button type="success" size="small" @click="addShow">添 加</el-button>
  </div>

  <el-table :data="list" style="width: 100%">
    <el-table-column prop="name" label="品牌名称" />
    <el-table-column prop="logo" label="品牌图标" #default="scope">
      <img :src="scope.row.logo" width="50" />
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间" />
    <el-table-column label="操作" align="center" width="200" #default="scope">
      <el-button type="primary" size="small" @click="editShow(scope.row)">
        修改
      </el-button>
      <el-button type="danger" size="small" @click="remove(scope.row.id)">
        删除
      </el-button>
    </el-table-column>
  </el-table>

  <el-dialog v-model="dialogVisible" title="添加或修改" width="30%">
    <el-form label-width="120px">
      <el-form-item label="品牌名称">
        <el-input v-model="brand.name" />
      </el-form-item>
      <el-form-item label="品牌图标">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8501/admin/system/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :headers="headers"
        >
          <img v-if="brand.logo" :src="brand.logo" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate">提交</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-pagination
    v-model:current-page="pageParams.page"
    v-model:page-size="pageParams.limit"
    :page-sizes="[10, 20, 50, 100]"
    layout="total, sizes, prev, pager, next"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  GetBrandPageList,
  SaveBrand,
  UpdateBrandById,
  DeleteBrandById,
} from '@/api/brand.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useApp } from '@/pinia/modules/app'

//=========================Delete
const remove = async id => {
  ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await DeleteBrandById(id)
    ElMessage.success('删除成功')
    fetchData()
  })
}

//=========================Update
// Enter modification
const editShow = row => {
  brand.value = row
  dialogVisible.value = true
}

// Update
const updateData = async () => {
  await UpdateBrandById(brand.value)
  dialogVisible.value = false
  ElMessage.success('操作成功')
  fetchData()
}

//=========================Create
const headers = {
  // Retrieve the token from Pinia and set it in the request header during file upload
  token: useApp().authorization.token,
}
// Define the data model for submitting form data
const defaultForm = {
  id: '',
  name: '',
  logo: '',
}
const brand = ref(defaultForm)
const dialogVisible = ref(false)

// Display the add brand form
const addShow = () => {
  brand.value = {}
  dialogVisible.value = true
}

// Upload
const handleAvatarSuccess = response => {
  brand.value.logo = response.data
}

// Save or update data
const saveOrUpdate = () => {
  if (!brand.value.id) {
    saveData()
  } else {
    updateData()
  }
}

// Save Data
const saveData = async () => {
  await SaveBrand(brand.value)
  dialogVisible.value = false
  ElMessage.success('操作成功')
  fetchData()
}

//=========================List
// Define the table data model
const list = ref([])

// Pagination bar data model
const total = ref(0)

// Pagination bar data model
const pageParamsForm = {
  page: 1, // Page number
  limit: 10, // Records per page
}
const pageParams = ref(pageParamsForm)

// Hook function
onMounted(() => {
  fetchData()
})

// Page change
const handleSizeChange = size => {
  pageParams.value.limit = size
  fetchData()
}
const handleCurrentChange = number => {
  pageParams.value.page = number
  fetchData()
}

// Pagination query
const fetchData = async () => {
  const { code, message, data } = await GetBrandPageList(
    pageParams.value.page,
    pageParams.value.limit
  )
  list.value = data.list
  total.value = data.total
}
</script>

<style scoped>
.tools-div {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
</style>
