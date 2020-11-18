import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import users from '../views/UseManager/users.vue'
import roles from '../views/PowerManager/roles.vue'
import rights from '../views/PowerManager/rights.vue'
import goods from '../views/GoodsManager/goods.vue'
import params from '../views/GoodsManager/params.vue'
import categories from '../views/GoodsManager/categories.vue'
import orders from '../views/OrderManager/orders.vue'
import reports from '../views/DataStatistics/reports.vue'


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
    component:Home,
    redirect:'/Welcome',
    children:[
      {
        path:'/Welcome',
        component:Welcome
      },
      {
        path:'/users',
        component:users
      },
      {
        path:'/roles',
        component:roles
      },
      {
        path:'/rights',
        component:rights
      },
      {
        path:'/goods',
        component:goods
      },
      {
        path:'/params',
        component:params
      },
      {
        path:'/categories',
        component:categories
      },
      {
        path:'/orders',
        component:orders
      },
      {
        path:'/reports',
        component:reports
      },
    ]
  },
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
