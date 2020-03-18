/**
 * plugin.js 专门提供小函数以及vue中常见的过滤器及函数
 */

export default {
  install (Vue) {
    //   该方法会在Vue.use时调用
    // 给Vue的原型属性赋值一个函数 自定义一个函数名
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
  }
}
