<template>
  <div class="tools-div">
    <el-button type="success" size="small" @click="exportData">Export</el-button>
    <el-button type="primary" size="small" @click="importData">Import</el-button>
  </div>

  <el-dialog v-model="dialogImportVisible" title="import" width="30%">
    <el-form label-width="120px">
      <el-form-item label="Category file">
        <el-upload
          class="upload-demo"
          action="http://localhost:8501/admin/product/category/importData"
          :on-success="onUploadSuccess"
          :headers="headers"
        >
          <el-button type="primary">Upload</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </el-dialog>

  <!---Lazy-loaded tree table-->
  <el-table
    :data="list"
    style="width: 100%"
    row-key="id"
    border
    lazy
    :load="fetchData"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  >
    <el-table-column prop="name" label="Category Name" />
    <el-table-column prop="imageUrl" label="image" #default="scope">
      <img :src="scope.row.imageUrl" width="50" />
    </el-table-column>
    <el-table-column prop="orderNum" label="Sort" />
    <el-table-column prop="status" label="Status" #default="scope">
      {{ scope.row.status == 1 ? 'Normal' : 'Disabled' }}
    </el-table-column>
    <el-table-column prop="createTime" label="createTime" />
  </el-table>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { FindCategoryByParentId, ExportCategoryData } from '@/api/category.js'
import { ElMessage, ElMessageBox } from 'element-plus'

//============================Import
import { useApp } from '@/pinia/modules/app'

// Definition of variables and methods related to file upload
const dialogImportVisible = ref(false)
const headers = {
  token: useApp().authorization.token, // Retrieve the token from Pinia and set it in the request header during file upload
}
const importData = () => {
  dialogImportVisible.value = true
}

// Execute this method after successful file upload
const onUploadSuccess = async (response, file) => {
  ElMessage.success('Operation Success')
  dialogImportVisible.value = false
  const { data } = await FindCategoryByParentId(0)
  list.value = data
}

//====================== Export
const list = ref([])

// Request backend API to retrieve data after the page has been initialized
onMounted(async () => {
  const { code, data, message } = await FindCategoryByParentId(0)
  list.value = data
})

// Load data
const fetchData = async (row, treeNode, resolve) => {
  // Send a request to the backend to retrieve data
  const { code, data, message } = await FindCategoryByParentId(row.id)

  // Return data
  resolve(data)
}

const exportData = () => {
  // Call the `ExportCategoryData()` method to obtain export data
  ExportCategoryData().then(res => {
    // Create a Blob object for containing binary data
    const blob = new Blob([res])
    // Create an 'a' tag element and convert the Blob object into a URL
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    // Set the name for the downloaded file
    link.download = 'Categorized_data.xlsx'
    // Simulate clicking the download link
    link.click()
  })
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
</style>
