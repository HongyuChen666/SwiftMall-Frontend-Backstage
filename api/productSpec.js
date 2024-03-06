import request from '@/utils/request'

const api_name = '/admin/product/productSpec'

// List
export const GetProductSpecPageList = (page, limit) => {
  return request({
    url: `${api_name}/${page}/${limit}`,
    method: 'get',
  })
}

// Save
export const SaveProductSpec = productSpec => {
  return request({
    url: `${api_name}/save`,
    method: 'post',
    data: productSpec,
  })
}

// Update
export const UpdateProductSpecById = productSpec => {
  return request({
    url: `${api_name}/updateById`,
    method: 'put',
    data: productSpec,
  })
}

// Delete
export const DeleteProductSpecById = id => {
  return request({
    url: `${api_name}/deleteById/${id}`,
    method: 'delete',
  })
}

// Query all product specification data
export const FindAllProductSpec = () => {
  return request({
    url: `${api_name}/findAll`,
    method: 'get',
  })
}
