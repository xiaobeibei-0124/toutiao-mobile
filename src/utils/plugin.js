/**
 * plugin.js 专门提供小函数以及vue中常见的过滤器及函数
 */
import dayjs from 'dayjs' // 引入dayjs插件
import relativeTime from 'dayjs/plugin/relativeTime' // 引入相对时间函数
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime) // 相当于 dayjs扩展 相对时间的方法 这个方法写完之后 dayjs 就有了form方法

export default {
  install (Vue) {
    //   该方法会在Vue.use时调用
    // 给Vue的原型属性赋值一个函数 自定义一个函数名
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })

    Vue.prototype.$sleep = sleep // 定义一个原型属性 $sleep 所有组件都有了这个属性
    // Vue.filter(名称, 函数)
    Vue.filter('relTime', relTime) // 注册一个全局过滤器 一旦注册任意位置都可以随意使用
  }
}

// 休眠函数
// time  = 500 如果你传入了time 用你的 如果说你没传 time 用 500
function sleep (time = 500) {
  // promise 成功返回resolve 失败返回reject
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve() // 直接返回成功
    }, time)
  })
}

// 相对时间函数
// date是指传入的时间
function relTime (date) {
  return dayjs().locale('zh-cn').from(date)
}
