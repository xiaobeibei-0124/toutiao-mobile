/**
 * 设置文件中的导航守卫
 */

import router from '@/router' // 引入路由实例
import store from '@/store' // 引入store对象 (vuex)

// 前置导航守卫
// 每当路由发生变化是，前置导航守卫就会执行
// to:你要到哪去 from:你从哪里来 next: 是否放行
router.beforeEach(function (to, from, next) {
  // 为了吸引用户与用户相关的则需要进行登录操作 其他可不登录进行浏览
  // 要去的路径以user开头 并且 token未过期则进行放行 否则去登录页，记录当前地址登录后跳回此页面
  if (to.path.startsWith('/user') && !store.state.user.token) {
    next({
      path: '/login',
      query: {
        redirectUrl: to.fullpath // 告诉登录页 我没有完成 访问 你登录之后 一定要帮我完成
      }
    })
  } else {
    // 一种是 地址不是 /user起始  一种是 /user起始 并且token存在
    next() // 直接放行
  }
})
