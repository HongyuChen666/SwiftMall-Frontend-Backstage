import request from '@/utils/request'

const base_api = '/admin/system/sysUser'

// User list
export const GetSysUserListByPage = (current, limit, queryDto) => {
  return request({
    // ``：Template string from ES6
    url: `${base_api}/findByPage/${current}/${limit}`, //Path
    method: 'get', //Submission Method
    // Interface "@RequestBody". Frontend data: param_name, transmit in JSON format.
    // If no "@RequestBody". Frontend params: param_name， transmit in plain format.
    params: queryDto, //Other Params
  })
}

// User Creation
export const SaveSysUser = sysUser => {
  return request({
    // ``：Template string from ES6
    url: `${base_api}/saveSysUser`, //Path
    method: 'post', //Submission Method
    data: sysUser, //Other Params
  })
}

// User update
export const UpdateSysUser = sysUser => {
  return request({
    // ``：Template string from ES6
    url: `${base_api}/updateSysUser`, //Path
    method: 'put', //Submission Method
    data: sysUser, //Other Params
  })
}

// User deletion
export const DeleteSysUser = userId => {
  return request({
    // ``：Template string from ES6
    url: `${base_api}/deleteById/${userId}`, //Path
    method: 'delete', //Submission Method
  })
}

// assign role to user
export const DoAssignRoleToUser = assginRoleVo => {
  return request({
    url: `${base_api}/doAssign`,
    method: 'post',
    data: assginRoleVo,
  })
}
