import request from '@/utils/request'

const api_name = '/admin/system/sysMenu'
// Page
export const FindNodes = () => {
  return request({
    url: `${api_name}/findNodes`,
    method: 'get',
  })
}

// Save
export const SaveMenu = sysMenu => {
  return request({
    url: `${api_name}/save`,
    method: 'post',
    data: sysMenu,
  })
}

// Update
export const UpdateSysMenuById = sysMenu => {
  return request({
    url: `${api_name}/update`,
    method: 'put',
    data: sysMenu,
  })
}

// Delete data by id
export const RemoveSysMenuById = id => {
  return request({
    url: `${api_name}/removeById/${id}`,
    method: 'delete',
  })
}
