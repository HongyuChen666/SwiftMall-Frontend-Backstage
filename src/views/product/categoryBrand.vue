<template>
  <div class="search-div">
    <el-form label-width="70px" size="small">
      <el-row>
        <el-col :span="12">
          <el-form-item label="Brand">
            <el-select
              class="m-2"
              placeholder="Select brand"
              size="small"
              style="width: 100%"
              v-model="queryDto.brandId"
            >
              <el-option
                v-for="item in brandList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Category">
            <el-cascader
              :props="categoryProps"
              style="width: 100%"
              v-model="searchCategoryIdList"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display:flex">
        <el-button type="primary" size="small" @click="fetchData()">
          Search
        </el-button>
        <el-button size="small" @click="resetData">Reset</el-button>
      </el-row>
    </el-form>
  </div>

  <div class="tools-div">
    <el-button type="success" size="small" @click="addShow">Add</el-button>
  </div>

  <el-dialog v-model="dialogVisible" title="Add or modify" width="30%">
    <el-form label-width="120px">
      <el-form-item label="Brand">
        <el-select
          class="m-2"
          placeholder="Select brand"
          size="small"
          v-model="categoryBrand.brandId"
        >
          <el-option
            v-for="item in brandList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Category">
        <el-cascader
          :props="categoryProps"
          v-model="categoryBrand.categoryId"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate">Submit</el-button>
        <el-button @click="dialogVisible = false">Cancel</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-table :data="list" style="width: 100%">
    <el-table-column prop="categoryName" label="Category" />
    <el-table-column prop="brandName" label="Brand" />
    <el-table-column prop="logo" label="logo" #default="scope">
      <img :src="scope.row.logo" width="50" />
    </el-table-column>
    <el-table-column prop="createTime" label="createTime" />
    <el-table-column label="Operation" align="center" width="200" #default="scope">
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { FindAllBrand } from '@/api/brand.js'
import { FindCategoryByParentId } from '@/api/category.js'
import {
  DeleteCategoryBrandById,
  UpdateCategoryBrandById,
  GetCategoryBrandPageList,
  SaveCategoryBrand,
} from '@/api/categoryBrand.js'
import { ElMessage, ElMessageBox } from 'element-plus'

//============================Delete
// Delete
const remove = async id => {
  ElMessageBox.confirm('This action will permanently delete the record. Are you sure you want to continue?', 'Warning', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(async () => {
      await DeleteCategoryBrandById(id)
      ElMessage.success('Deletion Success')
      fetchData()
    })
    .catch(() => {
      ElMessage.info('Cancel deletion')
    })
}

//=============================Update
// Enter modification
const editShow = row => {
  categoryBrand.value = row
  dialogVisible.value = true
}

// Submit save and update
const saveOrUpdate = () => {
  if (categoryBrand.value.brandId == '') {
    ElMessage.info('Brand information must be selected')
    return
  }
  // `categoryId` is an array: [1, 2, 3]
  if (categoryBrand.value.categoryId.length != 3) {
    ElMessage.info('Category information must be selected')
    return
  }
  // Only needs the third-level category IDs.
  categoryBrand.value.categoryId = categoryBrand.value.categoryId[2]
  if (!categoryBrand.value.id) {
    saveData()
  } else {
    updateData()
  }
}

// Update
const updateData = async () => {
  await UpdateCategoryBrandById(categoryBrand.value)
  dialogVisible.value = false
  ElMessage.success('Operation Success')
  fetchData()
}

//============================Create
const defaultForm = {
  // Page form data
  id: '',
  brandId: '',
  categoryId: '',
}
const categoryBrand = ref(defaultForm)

const dialogVisible = ref(false)

// Add
const addShow = () => {
  categoryBrand.value = {}
  dialogVisible.value = true
}

// Save
const saveData = async () => {
  await SaveCategoryBrand(categoryBrand.value)
  dialogVisible.value = false
  ElMessage.success('Operation Success')
  fetchData()
}

//============================List
const props = {
  lazy: true,
  value: 'id',
  label: 'name',
  leaf: 'leaf',
  async lazyLoad(node, resolve) {
    // Lazy load
    if (typeof node.value == 'undefined') node.value = 0
    const { data } = await FindCategoryByParentId(node.value)
    data.forEach(function(item) {
      // `hasChildren` to determine if there are child nodes
      item.leaf = !item.hasChildren
    })
    resolve(data)
  },
}

const categoryProps = ref(props)

// Query all brands
const selectAllBrandList = async () => {
  const { data } = await FindAllBrand()
  brandList.value = data
}

// Define the search form data model
const brandList = ref([])
// Define the table data model
const list = ref([])
// Pagination bar data model
const total = ref(0)
// Search form data model
const queryDto = ref({ brandId: '', categoryId: '' })
const searchCategoryIdList = ref([])
// Pagination bar data model
const pageParamsForm = {
  page: 1, // Page number
  limit: 2, // Records per page
}
const pageParams = ref(pageParamsForm)

// onMounted Hook
onMounted(() => {
  selectAllBrandList() // Query all brand data
  fetchData()
})

// Reset
const resetData = () => {
  queryDto.value = { brandId: '', categoryId: '' }
  searchCategoryIdList.value = []
  fetchData()
}

// Pagination change
const handleSizeChange = size => {
  pageParams.value.limit = size
  fetchData()
}
const handleCurrentChange = number => {
  pageParams.value.page = number
  fetchData()
}

// Pagination list query
const fetchData = async () => {
  if (searchCategoryIdList.value.length == 3) {
    queryDto.value.categoryId = searchCategoryIdList.value[2] // 2: the third level category
  }
  const { data } = await GetCategoryBrandPageList(
    pageParams.value.page,
    pageParams.value.limit,
    queryDto.value
  )
  list.value = data.list
  total.value = data.total
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
