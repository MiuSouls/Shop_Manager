import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path:'',
    redirect:'/Login'
  },
  {
    path:'/Login',
    component:Login
  },
  {
    path:'/Home',
    component:Home
  }
]

const router = new VueRouter({
  routes,
  mode:'history'
})

router.beforeEach((to,from,next)=>{
  //to 代表将要访问的路径
  //from 代表从哪个路径跳转而来
  //next 是一个函数，表示放行   <1> 直接next()  <2> next('/Login') 带强制跳转的地址

  if(to.path==='/Login') next()   //如果访问的是登录页直接放行

  const tokenStr=sessionStorage.getItem("token") 
  if(!tokenStr) next('/Login') //获取token如果为空就一样强制到登录界面
  next() //如果都没有就代表符合条件直接放行
})

export default router
