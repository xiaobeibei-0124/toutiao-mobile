/**
 * request.js 请求管理工具
 *
 */

import axios from 'axios'
import JSONBig from 'json-bigint'
import store from '@/store'

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
}, function (err) {
  // 失败的话返回错误信息
  return Promise.reject(err)
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
}, function (err) {
  return Promise.reject(err)
})

// 将设置好的新的axios实例导出
export default instance
