import axios from 'axios'

export function request(config){
    const instance=axios.create({
        // baseURL:'https://www.liulongbin.top:8888/api/private/v1/',  //学用
        baseURL:'http://timemeetyou.com:8889/api/private/v1/',   //网
        // baseURL:'http://www.ysqorz.top:8888/api/private/v1/',  //其他
        timeout:10000
    })

    instance.interceptors.request.use(res=>{
        res.headers.Authorization=sessionStorage.getItem("token")
        return res;
    })

    return instance(config)
}
 