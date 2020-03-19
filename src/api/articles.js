/**
 * 获取文章列表
 */
import request from '@/utils/request'
export function getArticles (params) {
  return request({
    // 此时接口地址换为v1.1 此时需要写入完整地址
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: {
      with_top: 1,
      ...params // params 为合并数据 包换id 和时间戳
    }
  })
}
