import Vue from 'vue'
import VueRouter from 'vue-router'

const Layout = () => import('@/views/layout')
const Home = () => import('@/views/home')
const Question = () => import('@/views/question')
const Video = () => import('@/views/video')
const User = () => import('@/views/user')
const Profile = () => import('@/views/user/profile')
const Chat = () => import('@/views/user/chat')
const Login = () => import('@/views/login')
const Search = () => import('@/views/search')
const SearchResult = () => import('@/views/search/result')
const Article = () => import('@/views/article')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Layout, // 一级路由
    children: [{
      path: '',
      component: Home // 二级路由首页
    }, {
      path: '/question',
      component: Question // 二级路由问答
    }, {
      path: '/video',
      component: Video // 二级路由视频
    }, {
      path: '/user',
      component: User // 二级路由用户
    }]
  }, {
    path: '/user/profile',
    component: Profile // 一级路由编辑资料
  }, {
    path: '/user/chat',
    component: Chat // 一级路由小智同学
  }, {
    path: '/login',
    component: Login // 一级路由登录组件
  }, {
    path: '/search',
    component: Search // 一级路由搜索中心组件
  }, {
    path: '/search/result',
    component: SearchResult // 一级路由搜索结果组件
  }, {
    path: '/article',
    component: Article // 一级路由文章详情
  }
]

const router = new VueRouter({
  routes
})

export default router
