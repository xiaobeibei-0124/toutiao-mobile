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

/**
 * 对文章不喜欢，不感兴趣接口
 */
export function disLike (data) {
  return request({
    url: '/article/dislikes',
    method: 'post',
    data
  })
}

/**
 *
 * 举报文章接口
 */
export function reportArticle (data) {
  return request({
    url: '/article/reports',
    method: 'post',
    data
  })
}
/**
 * 搜索建议
 */
export function getSuggestion (params) {
  return request({
    url: '/suggestion',
    params
  })
}
/**
 * 搜索文章结果接口
 */
export function searchArticle (params) {
  return request({
    url: '/search',
    params
  })
}
/**
 * 获取文章
 */
export function getArticleInfo (artId) {
  return request({
    url: `/articles/${artId}`
  })
}
