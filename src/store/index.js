import Vue from 'vue'
import Vuex from 'vuex'
// 引入处理token读写的规则
import * as auth from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 从缓存中读取token数据
    user: auth.getUser()
  },
  mutations: {
    // 定义更新token的方法
    updateUser (state, payload) {
      state.user = payload.user // 将传入的新的值赋值给state数据中
      // 更新之后将最新输入存入缓存中
      auth.setUser(payload.user)
    },
    // 删除token值
    delUser (state) {
      state.user = {} // 将vuex中的数据设置为空对象
      // 本地缓存数据也要一致
      auth.delUser()
    }
  },
  actions: {
  },
  modules: {
  }
})
