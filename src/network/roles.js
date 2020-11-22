import {request} from './request'

// ### 1.5.1. 角色列表
export function GetRolesLsit(){
  return request({
    url:'roles',
    method:'get'
  })
}

// ### 1.5.2. 添加角色
export function PostRoles(roleName,roleDesc){
  console.log(roleName);
  return request({
    url:'roles',
    method:'post',
    data:{
      roleName:roleName,
      roleDesc:roleDesc
    }
  })
}

// ### 1.5.3. 根据 ID 查询角色
export function GetRoles(id){
  return request({
    url:`roles/${id}`,
    method:'get'
  })
}

// ### 1.5.4. 编辑提交角色
export function PutRoles(id,roleName,roleDesc){
  return request({
    url:`roles/${id}`,
    method:'put',
    data:{
      roleName:roleName,
      roleDesc:roleDesc
    }
  })
}

// ### 1.5.5. 删除角色
export function DeleteRoles(id){
  return request({
    url:`roles/${id}`,
    method:'delete'
  })
}


// ### 1.5.7. 删除角色指定权限
export function DeleteRolesRights(roleId,rightId){
  return request({
    url:`roles/${roleId}/rights/${rightId}`,
    method:'delete'
  })
}


// ### 1.4.1. 所有权限列表
export function GetRightsList(type){
  return request({
    url:`rights/${type}`,
    method:'get'
  })
}


// ### 1.5.6. 角色授权
export function PostRolesRights(roleId,rids){
  return request({
    url:`roles/${roleId}/rights`,
    method:'post',
    data:{
      rids:rids
    }
  })
} 