<template>
  <div class="search-div">
    <!-- Search form -->
    <el-form label-width="70px" size="small">
      <el-form-item label="Role Name">
        <el-input
          v-model="queryDto.roleName"
          style="width: 100%"
          placeholder="Role Name"
        ></el-input>
      </el-form-item>
      <el-row style="display:flex">
        <el-button type="primary" size="small" @click="searchSysRole">
          Search
        </el-button>
        <el-button size="small" @click="resetData">Reset</el-button>
      </el-row>
    </el-form>

    <!-- Add form -->
    <div class="tools-div">
      <el-button type="success" size="small" @click="addShow">Add</el-button>
    </div>

    <!-- Add role form dialog -->
    <el-dialog v-model="dialogVisible" title="Add or Edit" width="30%">
      <el-form label-width="120px">
        <el-form-item label="Role Name">
          <el-input v-model="sysRole.roleName" />
        </el-form-item>
        <el-form-item label="Role Code">
          <el-input v-model="sysRole.roleCode" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">Submit</el-button>
          <el-button @click="dialogVisible = false">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--- Role table data -->
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="roleName" label="Role Name" width="180" />
      <el-table-column prop="roleCode" label="Role Code" width="180" />
      <el-table-column prop="createTime" label="Create Time" />
      <el-table-column label="Operation" align="center" width="280" #default="scope">
        <el-button type="primary" size="small" @click="editShow(scope.row)">
          Update
        </el-button>
        <el-button type="danger" size="small" @click="deleteById(scope.row)">
          Delete
        </el-button>
        <el-button
          type="warning"
          size="small"
          @click="showAssignMenu(scope.row)"
        >
          Assign Menu
        </el-button>
      </el-table-column>
    </el-table>

    <!-- Menu allocation dialog
        // Add the `ref` attribute to the tree component for later convenience in obtaining the tree component object
        -->
    <el-dialog v-model="dialogMenuVisible" title="Assign Menu" width="40%">
      <el-form label-width="80px">
        <el-tree
          :data="sysMenuTreeList"
          ref="tree"
          show-checkbox
          default-expand-all
          :check-on-click-node="true"
          node-key="id"
          :props="defaultProps"
        />
        <el-form-item>
          <el-button type="primary" @click="doAssign">Submit</el-button>
          <el-button @click="dialogMenuVisible = false">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--Pagination bar-->
    <el-pagination
      v-model:current-page="pageParams.page"
      v-model:page-size="pageParams.limit"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="fetchData"
      @current-change="fetchData"
      layout="total, sizes, prev, pager, next"
      :total="total"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  GetSysRoleListByPage,
  SaveSysRole,
  UpdateSysRole,
  DeleteSysRole,
  GetSysRoleMenuIds,
  DoAssignMenuIdToSysRole,
} from '@/api/sysRole'
import { ElMessage, ElMessageBox } from 'element-plus'

//====================== Assign menus to users=======================
const defaultProps = {
  children: 'children',
  label: 'title',
}
const dialogMenuVisible = ref(false)
const sysMenuTreeList = ref([])

// Tree object variable
const tree = ref()

// Default selected menu data collection
let roleId = ref()
const showAssignMenu = async row => {
  dialogMenuVisible.value = true
  roleId = row.id
  const { data } = await GetSysRoleMenuIds(row.id) // Request the backend address to fetch all menu data, as well as the menu data corresponding to the current role
  sysMenuTreeList.value = data.sysMenuList
  tree.value.setCheckedKeys(data.roleMenuIds) // Perform data echo
}

const doAssign = async () => {
  const checkedNodes = tree.value.getCheckedNodes() // Retrieve the selected nodes
  const checkedNodesIds = checkedNodes.map(node => {
    // Retrieve the IDs of the selected nodes
    return {
      id: node.id,
      isHalf: 0,
    }
  })

  // Retrieve data of partially selected nodes. When the child nodes of a node are partially selected, the node itself will appear in a partially selected state
  const halfCheckedNodes = tree.value.getHalfCheckedNodes()
  const halfCheckedNodesIds = halfCheckedNodes.map(node => {
    // Retrieve the IDs of partially selected nodes
    return {
      id: node.id,
      isHalf: 1,
    }
  })

  // Merge the IDs of selected nodes and partially selected nodes
  const menuIds = [...checkedNodesIds, ...halfCheckedNodesIds]
  console.log(menuIds)

  // Build the request data
  const assignMenuDto = {
    roleId: roleId,
    menuIdList: menuIds,
  }

  // Send the request
  await DoAssignMenuIdToSysRole(assignMenuDto)
  ElMessage.success('Operation Successful')
  dialogMenuVisible.value = false
}

//====================== Role Deletion(logical)======================
const deleteById = row => {
  ElMessageBox.confirm('This operation will permanently delete the record. Are you sure you want to proceed?', 'Warning', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning',
  }).then(async () => {
    const { code } = await DeleteSysRole(row.id)
    if (code === 200) {
      ElMessage.success('Delete Successful')
      fetchData()
    }
  })
}
//====================== Role Addition and Role Update======================
const roleForm = {
  id: '',
  roleName: '',
  roleCode: '',
}
const sysRole = ref(roleForm)
// true: open the dialog
const dialogVisible = ref(false)

// Dialog box data display
const editShow = row => {
  sysRole.value = { ...row } //copy row to value
  dialogVisible.value = true
}

//Method to display a dialog box when clicking on "Create"
const addShow = () => {
  // clear previous data
  sysRole.value = {}

  dialogVisible.value = true
}

// Create and Update
// Perform an update operation on sysRole if it contains an 'id' value; otherwise, perform an add operation.
const submit = async () => {
  if (!sysRole.value.id) {
    //no id, perform 'create'
    const { code } = await SaveSysRole(sysRole.value)
    if (code === 200) {
      // close dialog
      dialogVisible.value = false
      // prompt
      ElMessage.success('Operation Successful')
      // refresh page
      fetchData()
    }
  } else {
    // id exists, perform 'update'
    const { code } = await UpdateSysRole(sysRole.value)
    if (code === 200) {
      // close dialog
      dialogVisible.value = false
      // prompt
      ElMessage.success('Operation Successful')
      // refresh page
      fetchData()
    }
  }
}

//============================ Role List ===========================
// define data model
let list = ref([]) // Role list

let total = ref(0) //Total record count

const pageParamsForm = {
  page: 1, // current page
  limit: 3, // records per page
}
const pageParams = ref(pageParamsForm)

const queryDto = ref({ roleName: '' }) // Condition encapsulation data

// Hook function
onMounted(() => {
  fetchData()
})

// Operation Method: List method, Search method
// List method: axios
const fetchData = async () => {
  const { data, code, message } = await GetSysRoleListByPage(
    pageParams.value.page,
    pageParams.value.limit,
    queryDto.value
  )
  list.value = data.list
  total.value = data.total
}
// Search method
const searchSysRole = () => {
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
</style>
