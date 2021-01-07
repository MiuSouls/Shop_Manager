import Vue from 'vue'
import VueRouter from 'vue-router'

// 懒加载改造
//登录页
import Login from '../views/Login.vue'
// const Login = () =>import(/* webpackChunkName: "login_Home_Welcome"*/ '../views/Login.vue')
import Home from '../views/Home.vue'
// const Home = () =>import(/* webpackChunkName: "login_Home_Welcome"*/ '../views/Home.vue')
import Welcome from '../views/Welcome.vue'
// const Welcome = () =>import(/* webpackChunkName: "login_Home_Welcome"*/ '../views/Welcome.vue')

//UseManager
import users from '../views/UseManager/users.vue'
// const users = () =>import(/* webpackChunkName: "UseManager"*/ '../views/UseManager/users.vue')

//PowerManager
import roles from '../views/PowerManager/roles.vue'
// const roles = () =>import(/* webpackChunkName: "PowerManager"*/ '../views/PowerManager/roles.vue')
import rights from '../views/PowerManager/rights.vue'
// const rights = () =>import(/* webpackChunkName: "PowerManager"*/ '../views/PowerManager/rights.vue')

// GoodsManager
import goods from '../views/GoodsManager/goods.vue'
// const goods = () =>import(/* webpackChunkName: "GoodsManager"*/ '../views/GoodsManager/goods.vue')
import params from '../views/GoodsManager/params.vue'
// const params = () =>import(/* webpackChunkName: "GoodsManager"*/ '../views/GoodsManager/params.vue')
import categories from '../views/GoodsManager/categories.vue'
// const categories = () =>import(/* webpackChunkName: "GoodsManager"*/ '../views/GoodsManager/categories.vue')
import addSteps from '../views/GoodsManager/goods_children/addSteps.vue'
// const addSteps = () =>import(/* webpackChunkName: "GoodsManager"*/ '../views/GoodsManager/goods_children/addSteps.vue')

// OrderManager
import orders from '../views/OrderManager/orders.vue'
// const orders = () =>import(/* webpackChunkName: "OrderManager"*/ '../views/OrderManager/orders.vue')

// DataStatistics
import reports from '../views/DataStatistics/reports.vue'
// const reports = () =>import(/* webpackChunkName: "DataStatistics"*/ '../views/DataStatistics/reports.vue')



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
      {
        path:'/addSteps',
        component:addSteps
      }
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
