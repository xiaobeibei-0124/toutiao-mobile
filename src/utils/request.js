/**
 * request.js 请求管理工具
 *
 */

import axios from 'axios'
import JSONBig from 'json-bigint'
import store from '@/store'
import router from 'router'

// new一个新的axios实例
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 设置请求的基地址
  // 处理大数字格式的数据
  // 此函数是后台响应回来 但是还没进入到 axios的响应拦截器时执行 数组里可以写多个的处理函数
  transformResponse: [function (data) {
    return data ? JSONBig.parse(data) : {}
  }]
})

// 设置请求拦截器，在请求前插入token
instance.interceptors.request.use(function (config) {
  // 成功执行此函数
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
    // 返回配置
    return config
  }
}, function (error) {
  // 失败的话返回错误信息
  return Promise.reject(error)
})

// 设置响应拦截器
instance.interceptors.response.use(function (response) {
  // 对于响应回来的数据进行结构
  // 观察文档发现 大部分返回的数据都有data 所以分两种情况 两层还是只有axios增加的一层data
  try {
    return response.data.data // 如果成功则返回  如果两层可以解开 就返回两层
  } catch (error) {
    //  如果失败 说明 response.data不存在  如果两层解不开 就返回一层
    return response.data
  }
}, async function (error) {
  // 如果请求失败或者失效或者其他错误就会进入到错误的函数中
  // 如果是401就说明是token失效
  if (error.response && error.response.status === 401) {
    const path = {
      path: '/login', // 跳到登录页的地址
      query: {
        redirectUrl: router.currentRoute.fullPath // 表示登录页需要跳转的完整地址
      }
    }
    // 看是否有refresh_token
    if (store.state.user.refresh_token) {
      // 看refresh_token 是否可以换回新的token
      // 此时需要发送请求 用原始的axios(此时token已经过期 如果使用实例化对象instance来发送请求 请求拦截器会先一步进行执行 将过期的数据在诸如到请求中)
      // 请求采用await将异步请求变为同步请求，需要在父函数写入async
      try {
        const res = await axios({
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          method: 'put',
          headers: {
            Authorization: `Bearer ${store.state.user.refresh_token}`
          }
        })
        // 将新获取的token重新更新到vuex state
        store.commit('updateUser', {
          user: {
            token: res.data.data.token, // 最新的token
            refresh_token: store.state.user.refresh_token // 还是原来的refresh_token 14天之后过期
          }
        })
        //   你之所以会到这个位置 是因为  401, 也就意味着你之前的请求 是错误的
        //  需要把之前错误的请求再次发送出去 用axios 还是 instance呢
        return instance(error.config) // 相当于 执行之前出现401错误的请求  返回这个请求的目的 是继续执行这个请求执行链下面的内容
      } catch (error) {
        // 不幸的refresh_token 也过期 也无法获得新的token则进入到此错误
        // 跳入到登录页从新获取新的token 并删除用户数据
        store.commit('delUser')
        router.push(path)
      }
    } else {
      // 没有refresh_token  跳回登录页面从新获取token和 refresh_token
      // 为了更好的用户体验 在检验到token过期时携带当时的页面参数 方便登录后直接跳到此页面
      // 跳转界面之前删除本地用户数据(反正也过期了)
      // 用vuex管理想要修改state中的参数要用commit
      store.commit('delUser')
      router.push(path)
    }
  }
  return Promise.reject(error)
})

// 将设置好的新的axios实例导出
export default instance
