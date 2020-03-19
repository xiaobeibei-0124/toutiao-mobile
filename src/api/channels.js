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
