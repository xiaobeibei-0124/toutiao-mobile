import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/permission' // 引入前置导航守卫
import store from './store'
import Vant from 'vant' // 引入vant组件
import plugin from '@/utils/plugin'
import 'vant/lib/index.less' // 引入vant组件样式
import 'amfe-flexible' // 引入插件实时改变font-size大小
import '@/styles/index.less' // 引入自定义的全局样式  覆盖vant的样式

Vue.config.productionTip = false
Vue.use(Vant) // 全局注册使用组件
Vue.use(plugin) // 注册组件  需要放置在Vue.use(vant) 之后 因为我们要在 plugin中用vant的内置函数,必须等到vant注册完毕
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
