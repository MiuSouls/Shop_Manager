import {request} from './request'

//### 1.10.1. 订单数据列表
export function GetOrders(InPrams){
  return request({
    url:'orders',
    method:'get',
    params:{
      query:InPrams.query,
      pagenum:InPrams.CurrentPage,
      pagesize:InPrams.PageSize,
      user_id:InPrams.user_id,
      pay_status:InPrams.pay_status,
      is_send:InPrams.is_send,
      order_fapiao_title:InPrams.order_fapiao_title,
      order_fapiao_company:InPrams.order_fapiao_company,
      order_fapiao_content:InPrams.order_fapiao_content,
      consignee_addr:InPrams.consignee_addr
    }
  })
}

// ### 1.10.2. 修改订单状态
export function PutOrders(id,is_send,order_pay,order_price,order_number,pay_status){
  return request({
    url:`orders/${id}`,
    method:'put',
    data:{
      is_send:is_send,
      order_pay:order_pay,
      order_price:order_price,
      order_number:order_number,
      pay_status:pay_status
    }
  })
}


// ### 1.10.5. 查看物流信息
export function GetKuaidi(){
  return request({
    url:'/kuaidi/1106975712662',
    method:'get',
  })
}