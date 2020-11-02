import {request} from './request.js'

export function loginAxios(username,password){
    return request({
      url:'login',
      method:'get',
      params:{
        username: username,
        password: password
      }
    })
   }
