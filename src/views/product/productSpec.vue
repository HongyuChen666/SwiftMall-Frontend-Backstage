<template>
  <div class="tools-div">
    <el-button type="success" size="small" @click="addShow">Add</el-button>
  </div>

  <el-table :data="list" style="width: 100%">
    <el-table-column prop="specName" label="Specification name" />
    <el-table-column label="Specification value" #default="scope">
      <div
        v-for="(item1, index1) in scope.row.specValue"
        :key="index1"
        style="padding: 5px; margin: 0;width: 100%;"
      >
        {{ item1.key }}：
        <span
          v-for="(item2, index2) in item1.valueList"
          :key="index2"
          class="div-atrr"
        >
          {{ item2 }}
        </span>
      </div>
    </el-table-column>
    <el-table-column prop="createTime" label="createTime" />
    <el-table-column label="操作" align="center" width="200" #default="scope">
      <el-button type="primary" size="small" @click="editShow(scope.row)">
        Edit
      </el-button>
      <el-button type="danger" size="small" @click="remove(scope.row.id)">
        Delete
      </el-button>
    </el-table-column>
  </el-table>

  <el-pagination
    v-model:current-page="pageParams.page"
    v-model:page-size="pageParams.limit"
    :page-sizes="[10, 20, 50, 100]"
    layout="total, sizes, prev, pager, next"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
  <el-dialog v-model="dialogVisible" title="Edit or modify" width="40%">
    <el-form label-width="120px">
      <el-form-item label="Specification name">
        <el-input v-model="productSpec.specName" />
      </el-form-item>
      <el-form-item>
        <el-button size="default" type="success" @click="addSpec">
          Add new specification
        </el-button>
      </el-form-item>
      <el-form-item
        label=""
        v-for="(item, index) in productSpec.specValue"
        :key="index"
      >
        <el-row>
          <el-col :span="10">
            <el-input
              v-model="item.key"
              placeholder="Specification"
              style="width: 90%;"
            />
          </el-col>
          <el-col :span="10">
            <el-input
              v-model="item.valueList"
              placeholder="Specification values (e.g., white, red)"
              style="width: 90%;"
            />
          </el-col>
          <el-col :span="4">
            <el-button size="default" type="danger" @click="delSpec(index)">
              Delete
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item align="right">
        <el-button type="primary" @click="saveOrUpdate">Submit</el-button>
        <el-button @click="dialogVisible = false">Cancel</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  DeleteProductSpecById,
  GetProductSpecPageList,
  SaveProductSpec,
  UpdateProductSpecById,
} from '@/api/productSpec.js'
import { ElMessage, ElMessageBox } from 'element-plus'

// Table data model
const list = ref([
  {
    id: 2,
    createTime: '2023-05-06 12:56:08',
    specName: 'Laptop',
    specValue: [{ key: 'Memory', valueList: ['8G', '16G', '32G'] }],
  },
  {
    id: 1,
    createTime: '2023-05-06 12:40:22',
    specName: 'Apple',
    specValue: [
      { key: 'Color', valueList: ['White', 'Red', 'Black'] },
      { key: 'memory', valueList: ['8G', '16G'] },
    ],
  },
])

// Pagination bar data model
const total = ref(0)

const pageParamsForm = {
  page: 1, // Page number
  limit: 10, // Records per page
}
const pageParams = ref(pageParamsForm)

const dialogVisible = ref(false)

// Add form data model
const defaultForm = {
  id: '',
  specName: '',
  specValue: [
    {
      key: 'Color',
      valueList: ['White', 'Red', 'Black'],
    },
    {
      key: 'Memory',
      valueList: ['8G', '16G'],
    },
  ],
}
const productSpec = ref(defaultForm)

// pop-up window for updating
const editShow = row => {
  productSpec.value = row
  dialogVisible.value = true
}

// pop-up window for adding
const addShow = () => {
  dialogVisible.value = true
  productSpec.value = {
    id: '',
    specName: '',
    specValue: [],
  }
}

// Page addition of specification operations
const addSpec = () => {
  productSpec.value.specValue.push({})
}

// Page deletion of specification elements
const delSpec = index => {
  productSpec.value.specValue.splice(index, 1)
}

// Submit form
const saveOrUpdate = async () => {
  if (!productSpec.value.id) {
    saveData()
  } else {
    updateData()
  }
}

// save update
const updateData = async () => {
  // Submit the JSON string of `productSpec.value.specValue` to the backend. Achieve this by cloning a new object
  const productSpecClone = JSON.parse(JSON.stringify(productSpec.value))

  // Convert `productSpecClone.specValue.valueList` to an array, as the backend requires data in the array format: `[{"key":"内存","valueList":["8G","18G","32G"]}]`
  // The data model bound to `v-model` is a string
  productSpecClone.specValue.forEach(item => {
    console.log(typeof item.valueList)
    if (typeof item.valueList === 'string') {
      // Convert the data type to an array if it has changed to a string after modifying the specification data
      item.valueList = item.valueList.split(',')
    }
  })
  productSpecClone.specValue = JSON.stringify(productSpecClone.specValue)

  // Submit the form
  await UpdateProductSpecById(productSpecClone)

  dialogVisible.value = false
  ElMessage.success('Operation Success')
  fetchData()
}

// Save data
const saveData = async () => {
  // Submit the JSON string of `productSpec.value.specValue` to the backend. Achieve this by cloning a new object
  const productSpecClone = JSON.parse(JSON.stringify(productSpec.value))

  // Convert `productSpecClone.specValue.valueList` to an array, as the backend requires data in the array format: `[{"key":"内存","valueList":["8G","18G","32G"]}]`
  // The data model bound to `v-model` is a string
  productSpecClone.specValue.forEach(item => {
    item.valueList = item.valueList.split(',')
  })
  productSpecClone.specValue = JSON.stringify(productSpecClone.specValue)

  console.log(productSpecClone)

  // Submit the form
  await SaveProductSpec(productSpecClone)

  dialogVisible.value = false
  ElMessage.success('Operation Success')
  fetchData()
}

// Delete
const remove = async id => {
  ElMessageBox.confirm('This action will permanently delete the record. Are you sure you want to continue?', 'Warning', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(async () => {
      await DeleteProductSpecById(id)
      ElMessage.success('Deletion successful')
      fetchData()
    })
    .catch(() => {
      ElMessage.info('Cancel deletion')
    })
}

// Hook
onMounted(() => {
  fetchData()
})

// Page changes
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
  const { data } = await GetProductSpecPageList(
    pageParams.value.page,
    pageParams.value.limit
  )
  data.list.forEach(item => {
    item.specValue = JSON.parse(item.specValue) // Convert the specification string to a JavaScript object
  })
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

.div-atrr {
  padding: 5px 10px;
  margin: 0 10px;
  background-color: powderblue;
  border-radius: 10px;
}
</style>
