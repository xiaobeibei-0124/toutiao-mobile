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
