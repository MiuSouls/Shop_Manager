import {request} from './request'

// ### 1.11.1.  基于时间统计的折线图
export function GetReports(){
  return request({
    url:'reports/type/1',
    method:'get'
  })
}