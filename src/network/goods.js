import {request} from './request'

// ### 1.8.1. 商品列表数据
export function GetGoods(query,pagenum,pagesize){
  return request({
    url:'goods',
    method:'get',
    params:{
      query:query,
      pagenum:pagenum,
      pagesize:pagesize
    }
  })
}

// ### 1.8.5. 删除商品
export function DeleteGoods(id){
  return request({
    url:`goods/${id}`,
    method:'delete'
  })
}

//### 1.8.2. 添加商品
export function PostGoods(form){
  return request({
    url:'goods',
    method:'post',
    data:{
      goods_name:form.goods_name,
      goods_cat:form.goods_cat,
      goods_price:form.goods_price,
      goods_number:form.goods_number,
      goods_weight:form.goods_weight,
      goods_introduce:form.goods_introduce,
      pics:form.pics,
      attrs:form.attrs
    }

  })
}