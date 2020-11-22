import {request} from './request'

// ### 1.4.1. 所有权限列表
export function GetRights(type){
  return request({
    url:`rights/${type}`,
    method:'get'
  })
}