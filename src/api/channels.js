/**
 *
 * 用来处理频道的请求
 */

import request from '@/utils/request'
export function getChannels () {
  // 返回一个promise
  return request({
    url: '/user/channels'
  })
}

/**
 * 获取所有频道接口
 */
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}
