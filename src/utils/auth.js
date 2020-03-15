/**
 * auth.js 专门处理 token的读写和删除
 *
 */

// 定义一个token用来存储用户信息
const USER_TOKEN = 'heima-toutiao-mobile-94'

// 设置用户的token信息
export function setUser (user) {
  // 存储到本地缓存中的值应为字符串形式 所以要用json转变一下
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user))
}

// 获取用户的token信息
export function getUser () {
  return JSON.parse(window.localStorage.getItem(USER_TOKEN) || '{}')
  // 获取信息 要有返回值 返回的应是对象形式 如果为空的返回空对象
  // 提取本地值得时候要用json转为对象形式
  // ||短路表达式 当前面为false才会执行后面的信息
}

// 删除用户的token信息
export function delUser (params) {
  localStorage.removeItem(USER_TOKEN)
}
