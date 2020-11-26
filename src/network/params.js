import {request} from './request'

// ### 1.7.1. 参数列表
export function GetCategoriesAttributes(id,sel){
  return request({
    url:`categories/${id}/attributes`,
    method:'get',
    params:{
      sel:sel
    }
  })
}

// ### 1.7.2. 添加动态参数或者静态属性
export function PostCategoriesAttributes(id,attr_name,attr_sel,attr_vals){
  return request({
    url:`categories/${id}/attributes`,
    method:'post',
    data:{
      attr_name:attr_name,
      attr_sel:attr_sel,
      attr_vals:attr_vals
    }
  })
}