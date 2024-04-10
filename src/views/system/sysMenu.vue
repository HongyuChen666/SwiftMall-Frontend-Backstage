<template>
  <div class="tools-div">
    <el-button type="success" size="small" @click="addShow">Add</el-button>
  </div>

  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
    <el-form label-width="120px">
      <el-form-item label="MenuTitle">
        <el-input v-model="sysMenu.title" />
      </el-form-item>
      <el-form-item label="RouteName">
        <el-input v-model="sysMenu.component" />
      </el-form-item>
      <el-form-item label="Sort">
        <el-input v-model="sysMenu.sortValue" />
      </el-form-item>
      <el-form-item label="Status">
        <el-radio-group v-model="sysMenu.status">
          <el-radio :label="1">Normal</el-radio>
          <el-radio :label="0">Disabled</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate">Submit</el-button>
        <el-button @click="dialogVisible = false">Cancel</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-table
    :data="list"
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    border
    default-expand-all
  >
    <el-table-column prop="title" label="MenuTitle" />
    <el-table-column prop="component" label="RouteName" />
    <el-table-column prop="sortValue" label="Sort" />
    <el-table-column prop="status" label="Status" #default="scope">
      {{ scope.row.status == 1 ? 'Normal' : 'Disabled' }}
    </el-table-column>
    <el-table-column prop="createTime" label="createTime" />

    <el-table-column label="Operation" align="center" width="280" #default="scope">
      <el-button type="success" size="small" @click="addShow(scope.row)">
        Add child-node
      </el-button>
      <el-button type="primary" size="small" @click="editShow(scope.row)">
        Edit
      </el-button>
      <el-button type="danger" size="small" @click="remove(scope.row.id)">
        Delete
      </el-button>
    </el-table-column>
  </el-table>
</template>

<script setup>
// Introduce the invoked method
import { ref, onMounted } from 'vue'
import {
  FindNodes,
  SaveMenu,
  UpdateSysMenuById,
  RemoveSysMenuById,
} from '@/api/sysMenu'
import { ElMessage, ElMessageBox } from 'element-plus'

const list = ref([])

// Define the data model for adding form menu and form-related data
const dialogTitle = ref('Add')
const dialogVisible = ref(false)

// Page form data
const defaultForm = {
  id: '',
  parentId: 0,
  title: '',
  url: '',
  component: '',
  icon: '',
  sortValue: 1,
  status: 1,
}
// Form responsive data model object
const sysMenu = ref(defaultForm)

//=======================Load data=========================
onMounted(() => {
  fetchData()
})

//=======================Add and update functionalities====================
// pop-up window for adding
const addShow = row => {
  sysMenu.value = {}
  dialogVisible.value = true
  if (!row.id) {
    dialogTitle.value = 'Add'
  } else {
    dialogTitle.value = 'Add child-node'
    sysMenu.value.parentId = row.id
  }
}

// pop-up window for updating
const editShow = row => {
  sysMenu.value = row
  dialogVisible.value = true
}

// Submit save and update
const saveOrUpdate = () => {
  if (!sysMenu.value.id) {
    if (!sysMenu.value.parentId) {
      sysMenu.value.parentId = 0
    }
    saveData()
  } else {
    updateData()
  }
}

// update
const updateData = async () => {
  await UpdateSysMenuById(sysMenu.value)
  dialogVisible.value = false
  ElMessage.success('Operation Success')
  fetchData()
}

// save
const saveData = async () => {
  await SaveMenu(sysMenu.value)
  dialogVisible.value = false
  ElMessage.success('Operation Success')
  fetchData()
}

//=======================Pagination list====================
const fetchData = async () => {
  const { code, data, message } = await FindNodes()
  list.value = data
}

//=======================Delete====================
const remove = async id => {
  console.log('removeDataById:' + id)
  ElMessageBox.confirm('This action will permanently delete the record. Are you sure you want to continue?', 'Warning', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning',
  }).then(async () => {
    const { code, message } = await RemoveSysMenuById(id)
    if (code === 200) {
      ElMessage.success('Deletion successful')
      fetchData()
    } else {
      ElMessage.error(message)
    }
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
