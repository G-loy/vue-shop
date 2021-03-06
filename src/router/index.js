import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path:'/login',
      component:Login
    },
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:'/home',
      component:Home,
      redirect:"/welcome",
      children:[
        {
          path:'/welcome',
          component:Welcome
        },
        {
          path:'/users',
          component:User
        },
        {
          path:'/rights',
          component:Rights
        },
        {
          path:'/roles',
          component:Roles
        }
      ]
      
    }
  ]
})
//挂载路由导航守卫
router.beforeEach(( to,from,next) =>{
  //to 将要访问的路径
  //from 代表从哪个路径跳转而来
  //next 是一个函数，表示放行
  // next() 放行 next('/login')
  if(to.path ==='/login') return next()
  
  const tokenStr = window.sessionStorage.getItem('token')

  if(!tokenStr) return next('/login')
  next()
})

export default router