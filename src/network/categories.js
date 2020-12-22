import {request} from './request'

// ### 1.6.1. 商品分类数据列表
export function GetCategories(type,pagenum,pagesize){
  return request({
    url:'categories',
    method:'get',
    params:{
      type:type,
      pagenum:pagenum,
      pagesize:pagesize
    }
  })
} 

// ### 1.6.2. 添加分类
export function PostCategories(cat_pid,cat_name,cat_level){
  return request({
    url:'categories',
    method:'post',
    data:{
      cat_pid:cat_pid,
      cat_name:cat_name,
      cat_level:cat_level
    }
  })
}

// ### 1.6.4. 编辑提交分类
export function PutCategories(id,cat_name){
  return request({
    url:`categories/${id}`,
    method:'put',
    data:{
      cat_name:cat_name
    }
  })
}

// ### 1.6.5. 删除分类
export function DeleteCategories(id){
  return request({
    url:`categories/${id}`,
    method:'delete'
  })
}