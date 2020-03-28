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
/**
 * 关注用户
 */
export function followUser (data) {
  return request({
    url: '/user/followings',
    method: 'post',
    data
  })
}
/**
 * 取消关注用户
 */
export function unfollowUser (autid) {
  return request({
    url: `/user/followings/${autid}`,
    method: 'delete'
  })
}
/**
 * 获取用户自己的个人信息
 */
export function getUserInfo () {
  return request({
    url: '/user'
  })
}
/**
 * 获取用户个人资料
 */
export function getUserProfile (params) {
  return request({
    url: '/user/profile'
  })
}
/**
 * 修改用户头像
 */
export function updatePhoto (data) {
  return request({
    url: '/user/photo',
    method: 'patch',
    data
  })
}
/***
 * 保存用户信息
 */
export function saveUserInfo (data) {
  return request({
    url: '/user/profile',
    method: 'patch',
    data: { ...data, photo: null }// 直接将photo设置为空
  })
}
