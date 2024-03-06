import request from '@/utils/request'

const api_name = '/admin/product/brand'

// List
export const GetBrandPageList = (page, limit) => {
  return request({
    url: `${api_name}/${page}/${limit}`,
    method: 'get',
  })
}

// Create
export const SaveBrand = brand => {
  return request({
    url: `${api_name}/save`,
    method: 'post',
    data: brand,
  })
}

// Update
export const UpdateBrandById = brand => {
  return request({
    url: `${api_name}/updateById`,
    method: 'put',
    data: brand,
  })
}

// Delete
export const DeleteBrandById = id => {
  return request({
    url: `${api_name}/deleteById/${id}`,
    method: 'delete',
  })
}

// Query all brands
export const FindAllBrand = () => {
  return request({
    url: `${api_name}/findAll`,
    method: 'get',
  })
}
