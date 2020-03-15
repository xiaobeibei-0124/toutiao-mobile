import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant' // 引入vant组件
import 'vant/lib/index.css' // 引入vant组件样式
import 'amfe-flexible' // 引入插件实时改变font-size大小
import '@/styles/index.less' // 引入自定义的全局样式  覆盖vant的样式

Vue.config.productionTip = false
Vue.use(Vant) // 全局注册使用组件
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
