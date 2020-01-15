import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {//判断是否有token
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {//判断是否有用户的角色信息
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          const roles = res.data.roles
          store.dispatch('generateRouters', { roles }).then(() => {// 生成可访问的路由表
            console.log(store.getters.permission_routers)
            router.addRoutes(store.getters.addRouters)// 动态添加可访问路由表
            next({ ...to, replace:true })// hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
          // next()
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { //免登录白名单
      next()
    } else { // 否则全部重定向到登录页
      if(store.getters.is_logout){
        next({ path: '/login' }) //登出后不需要记录重定向路由
      }else{
        next(`/login?redirect=${to.path}`) 
      }
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
