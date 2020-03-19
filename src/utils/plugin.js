/**
 * plugin.js 专门提供小函数以及vue中常见的过滤器及函数
 */

export default {
  install (Vue) {
    //   该方法会在Vue.use时调用
    // 给Vue的原型属性赋值一个函数 自定义一个函数名
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })

    Vue.prototype.$sleep = sleep // 定义一个原型属性 $sleep 所有组件都有了这个属性
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
