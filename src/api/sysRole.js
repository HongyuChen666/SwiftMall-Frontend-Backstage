import request from '@/utils/request'

const base_api = '/admin/system/sysRole'
// Role list
export const GetSysRoleListByPage = (current, limit, queryDto) => {
  return request({
    // ``：Template string from ES6
    url: `${base_api}/findByPage/${current}/${limit}`, //Path
    method: 'post', //Submission Method
    // Interface "@RequestBody". Frontend data: param_name, transmit in JSON format.
    // If no "@RequestBody". Frontend params: param_name， transmit in plain format.
    data: queryDto, //Other Params
  })
}

// Role addition
export const SaveSysRole = sysRole => {
  return request({
    // ``：Template string from ES6
    url: `${base_api}/saveSysRole`, //Path
    method: 'post', //Submission Method
    data: sysRole, //Other Params
  })
}

// Role update
export const UpdateSysRole = sysRole => {
  return request({
    // ``：Template string from ES6
    url: `${base_api}/updateSysRole`, //Path
    method: 'put', //Submission Method
    data: sysRole, //Other Params
  })
}

// Role deletion(logical)
export const DeleteSysRole = roleId => {
  return request({
    // ``：Template string from ES6
    url: `${base_api}/deleteById/${roleId}`, //Path
    method: 'delete', //Submission Method
  })
}

// Read all roles
export const GetAllRoleList = userId => {
  return request({
    url: `/admin/system/sysRole/findAllRoles/${userId}`,
    method: 'get',
  })
}

// Query the menu IDs corresponding to the specified role.
export const GetSysRoleMenuIds = roleId => {
  return request({
    url: '/admin/system/sysRoleMenu/findSysRoleMenuByRoleId/' + roleId,
    method: 'get',
  })
}

// Method for handling menu assignment based on roles.
export const DoAssignMenuIdToSysRole = assignMenuDto => {
  return request({
    url: '/admin/system/sysRoleMenu/doAssign',
    method: 'post',
    data: assignMenuDto,
  })
}
