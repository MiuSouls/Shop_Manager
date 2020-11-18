import {request} from './request.js'

// ### 1.2.1. 登录验证接口
export function PostLogin(username,password){
    return request({
      url:'login',
      method:'post',
      data:{
        username: username,
        password: password
      }
    })
   }
