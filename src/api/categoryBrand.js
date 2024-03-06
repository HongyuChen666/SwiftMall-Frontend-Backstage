import request from '@/utils/request'

const api_name = '/admin/product/categoryBrand'

// page list
export const GetCategoryBrandPageList = (page, limit, searchObj) => {
  return request({
    url: `${api_name}/${page}/${limit}`,
    method: 'get',
    params: searchObj,
  })
}

// Create/Save
export const SaveCategoryBrand = categoryBrand => {
  return request({
    url: `${api_name}/save`,
    method: 'post',
    data: categoryBrand,
  })
}

// Update
export const UpdateCategoryBrandById = categoryBrand => {
  return request({
    url: `${api_name}/updateById`,
    method: 'put',
    data: categoryBrand,
  })
}

// Delete
export const DeleteCategoryBrandById = id => {
  return request({
    url: `${api_name}/deleteById/${id}`,
    method: 'delete',
  })
}

// Retrieve brand data based on the category id
export const FindBrandByCategoryId = categoryId => {
  return request({
    url: `${api_name}/findBrandByCategoryId/${categoryId}`,
    method: 'get',
  })
}
