import { request } from './request'


// ### 1.3.1. 用户数据列表
export function GetUsers(query,pagenum, pagesize) {
    return request({
        url: 'users',
        method: 'get',
        params: {
            query:query,
            pagenum: pagenum,
            pagesize: pagesize
        }
    })
}

// ### 1.3.3. 修改用户状态
export function PutUserState(uId,type){
    
    let urls="users/"+uId+"/state/"+type
    return request({
        //方法一
        url:urls,

        //方法二(注意这里的符号不是单引号，而是 “反单引号” )
        // url:`users/${uId}/state/${type}`,
        method:"put",
    })
}

// ### 1.3.4. 根据 ID 查询用户信息
export function GetSelectUsers(id){
    return request({
        url:`users/${id}`,
        method:'get'
    })
}

// ### 1.3.2. 添加用户
export function PostUsers(username,password,email,mobile){
    return request({
        url:'users',
        method:'post',
        data:{
            username,
            password,
            email,
            mobile,
        }
    })
}

// ### 1.3.5. 编辑用户提交
export function SetUsers(id,email,mobile){
    return request({
        url:`users/${id}`,
        method:'put',
        data:{
            email:email,
            mobile:mobile
        }
    })
}

//### 1.3.6. 删除单个用户
export function DeleteRoles(id){
    return request({
        url:`users/${id}`,
        method:'delete',
    })
}


// ### 1.3.7. 分配用户角色
export function PutUsersRole(id,rid){
    return request({
        url:`users/${id}/role`,
        // url:'users/1270/role',
        method:'put',
        data:{
            rid:rid
        }
    })
}