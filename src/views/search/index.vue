<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <van-search @search='onSearch' v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <!-- 联想内容，有文字输入时显示 -->
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell icon="search" v-for="(item,index) in suggestList" :key="index" @click="toSearch(item)">
        {{item}}
      </van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
    <div class="history-box" v-else>
      <!-- 头部，有历史记录才会显示 -->
      <div class="head" v-if="historyList.length">
        <span>历史记录</span>
        <van-icon name="delete" @click="clear"></van-icon>
      </div>
      <!-- 历史记录列表项 -->
      <van-cell-group>
        <van-cell v-for="(item,index) in historyList" :key="index" @click="toSearch(item)">
          <a class="word_btn">{{item}}</a>
          <!-- click.stop 阻止事件冒泡，防止点击删除冒泡到上层跳转到查询结果 -->
          <van-icon class="close_btn" slot="right-icon" name="cross" @click.stop="delHistory(index)"/>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { getSuggestion } from '@/api/articles'
const key = 'hm-94-heistory' // 用来记录本地缓存中的key
export default {
  name: 'search',
  data () {
    return {
      q: '', // 输入框的信息
      historyList: JSON.parse(localStorage.getItem(key) || '[]'), // 作为一个数据变量 接收 搜索历史记录
      suggestList: []
    }
  },
  watch: {
    q () {
      // 防抖函数
      // 监视到输入框值改变就会启动计时器，返回一个值
      // 计时器内函数体在300毫秒后才会执行，300毫秒内又监视到输入框值改变，首先取消上一个计时器就不会执行计时器内函数
      // 当300毫秒内没有变化就会发送请求,进而形成防抖效果
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        // 需要判断 当清空的时候 不能发送请求 但是要把联想的建议清空
        if (!this.q) {
          this.suggestList = []
          // 不用在继续了
          return
        }
        const data = await getSuggestion({ q: this.q })
        this.suggestList = data.options // 将返回的词条的options赋值给 当前的联想建议
      }, 300)
    }
  },
  methods: {
    // 删除历史记录
    delHistory (index) {
      this.historyList.splice(index, 1) // 直接删除对应的历史记录
      localStorage.setItem(key, JSON.stringify(this.historyList))
    },
    // 点击历史记录跳转（更新到下边）
    // toSearchResult (item) {
    //   this.$router.push({
    //     path: '/search/result', // 需要传递查询参数 查询的是什么
    //     query: { q: item }
    //   })
    // },
    // 点击删除全部历史记录
    async clear () {
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '您确定要删除所有记录吗？'
        })
        this.historyList = []
        localStorage.setItem(key, [])
      } catch (error) {
        // 失败就是点击取消 什么都不需要操作
      }
    },
    // 点击搜索时触发
    onSearch () {
      // 首先判断的搜索内容为空 为空 直接返回
      if (!this.q) return
      // 应该在跳转之前 应该把搜索的结果 添加到历史记录
      // 这里要去重 set
      this.historyList.push(this.q)
      this.historyList = Array.from(new Set(this.historyList)) // 去重
      localStorage.setItem(key, JSON.stringify(this.historyList))// 写入本地
      // 跳转到搜索结果页面
      this.$router.push({
        path: '/search/result',
        query: { q: this.q }
      })
    },
    // 点击联想搜索具体实例 跳转到结果页 && 点击历史记录跳转到结果
    toSearch (text) {
      // 点击之后要把点击的加到历史记录里
      this.historyList.push(text)
      this.historyList = Array.from(new Set(this.historyList))
      localStorage.setItem(key, JSON.stringify(this.historyList))
      this.$router.push({
        path: '/search/result',
        query: { q: text }
      })
    }
  }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
