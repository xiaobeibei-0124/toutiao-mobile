/**
 * 专门处理与用户相关的请求
 */

// 引入之前封装好的请求函数 拥有axios的全部属性 相当于一个axios实例
import request from '@/utils/request'
// 用户登录的请求
export function login (data) {
  return request({
    url: '/authorizations',
    method: 'post',
    data
  })
  // 返回一个promise对象
}
