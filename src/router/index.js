import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/

//所有权限通用路由表
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '在线教育平台后台首页', icon: 'dashboard' }
    }]
  },
]

//实例化vue时只挂载constantRoutr
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

//异步挂载的路由，根据权限动态加载
export const asyncRouterMap = [
  // 讲师管理
  {
    path: '/edu/teacher',
    component: Layout,
    redirect: '/edu/teacher/list',
    name: 'Teacher',
    meta: { title: '讲师管理', icon: 'peoples', role: ['admin','teacher']},
    children: [
      {
        path: 'list',
        name: 'EduTeacherList',
        component: () => import('@/views/edu/teacher/list'),
        meta: { title: '讲师列表', role: ['admin','teacher'] }
      },
      {
        path: 'create',
        name: 'EduTeacherCreate',
        component: () => import('@/views/edu/teacher/form'),
        meta: { title: '添加讲师', role: ['admin',] }
      },
      {
        path: 'edit/:id',
        name: 'EduTeacherEdit',
        component: () => import('@/views/edu/teacher/form'),
        meta: { title: '编辑讲师', noCache: true, role: ['admin',] },
        hidden: true
      }
    ]
  },
  //课程分类管理
  {
    path: '/edu/subject',
    component: Layout,
    redirect: '/edu/subject/list',
    name: 'Subject',
    meta: { title: '课程分类管理', icon: 'nested', role: ['admin','teacher'] },
    children: [
      {
        path: 'list',
        name: 'EduSubjectList',
        component: () => import('@/views/edu/subject/list'),
        meta: { title: '课程分类列表', role: ['admin','teacher'] }
      },
    ]
  },
  //课程管理
  {
    path: '/edu/course',
    component: Layout,
    redirect: '/edu/course/list',
    name: 'Course',
    meta: { title: '课程管理', icon: 'form', },
    children: [
      {
        path: 'list',
        name: 'EduCourseList',
        component: () => import('@/views/edu/course/list'),
        meta: { title: '课程列表', role: ['admin','teacher'] }
      },
      {
        path: 'info',
        name: 'EduCourseInfo',
        component: () => import('@/views/edu/course/info'),
        meta: { title: '发布课程', role: ['admin','teacher'] }
      },
      {
        path: 'edit/:id',
        name: 'EduCourseEdit',
        component: () => import('@/views/edu/course/info'),
        meta: { title: '编辑课程信息',noCache: true, role: ['admin','teacher'] },
        hidden: true
      },
      {
        path: 'chapter',
        name: 'EduCourseChapter',
        component: () => import('@/views/edu/course/chapter'),
        meta: { title: '编辑课程大纲',noCache: true, role: ['admin','teacher'] },
        hidden: true
      },
      {
        path: 'publish/:id',
        name: 'EduCoursePublish',
        component: () => import('@/views/edu/course/publish'),
        meta: { title: '发布课程',noCache: true, role: ['admin','teacher'] },
        hidden: true
      },
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]