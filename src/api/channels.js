/**
 *
 * 用来处理频道的请求
 */
import store from '@/store'
import request from '@/utils/request'
const CACHE_CHANNEL_V = 'hm-94-toutiao-v' // 登陆
const CACHE_CHANNEL_T = 'hm-94-toutiao-t' // 未登录，游客
// 对获取频道数据进行本地化处理 不光登不登录 写入本地 区分游客或者登陆，后续添加删除频道
export function getChannels () {
  // 返回一个promise
  return new Promise(function (resolve, reject) {
    // 用vuex中用户的token来区分是都是登陆
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    // 去缓存中读取用户数据
    const str = localStorage.getItem(key) // 通过缓存key获取缓存中的用户的频道数据
    if (str) {
      // 本地缓存中有数据，直接返回出去
      resolve({ channels: JSON.parse(str) })
    } else {
      // 本地缓存中没有数据，去服务器获取
      request({ url: '/user/channels' }).then(result => {
        // 将获取到的频道数据存在本地缓存
        localStorage.setItem(key, JSON.stringify(result.channels))
        // 将频道数据返回
        resolve(result)
      })
    }
  })
  // return request({
  //   url: '/user/channels'
  // })
}
/**
 * 获取所有频道接口
 */
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}
/**
 * 删除频道接口
 * params:id 频道的id
 */
export function delChannels (id) {
  return new Promise(function (resolve, reject) {
    // 童颜判断是否登录
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    // 直接将本地缓存中的字符串转化成对象
    const channels = JSON.parse(localStorage.getItem(key))
    // 根据传入的id找到对应的索引
    const index = channels.findIndex(item => item.id === id)
    if (index > -1) {
      // 删除本地缓存的频道
      channels.splice(index, 1)
      // 将新的频道存入缓存
      localStorage.setItem(key, JSON.stringify(channels))
      // 返回结果
      resolve()
    } else {
      // 没有找到对应的索引
      reject(new Error('没有找到对应的频道...'))
    }
  })
}
/**
 * 添加频道
 * params 要添加的频道 channel
 */
export function addChannel (channel) {
  return new Promise(function (resolve) {
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    const channels = JSON.parse(localStorage.getItem(key))// 转化数组 得到缓存中的数据
    channels.push(channel)// 将新的频道加到队尾
    localStorage.setItem(key, JSON.stringify(channels)) // 重新写入新的数组
    resolve()// 返回结果
  })
}
