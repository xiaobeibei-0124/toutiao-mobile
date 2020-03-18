/**
 * 需要导出一个对象，来修改vant的颜色
 *
 */
module.exports = {
  // 需要更改less中变量的配置
  // vuecli cssmodules + vant定制主题
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          blue: '#3296fa'
        }
      }
    }
  }
}
