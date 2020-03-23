<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <van-search @search='onSearch' v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <!-- 联想内容，有文字输入时显示 -->
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell icon="search">
        <span>j</span>ava
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
        <van-cell v-for="(item,index) in historyList" :key="index" @click="toSearchResult(item)">
          <a class="word_btn">{{item}}</a>
          <!-- click.stop 阻止事件冒泡，防止点击删除冒泡到上层跳转到查询结果 -->
          <van-icon class="close_btn" slot="right-icon" name="cross" @click.stop="delHistory(index)"/>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
const key = 'hm-94-heistory' // 用来记录本地缓存中的key
export default {
  name: 'search',
  data () {
    return {
      q: '', // 输入框的信息
      historyList: JSON.parse(localStorage.getItem(key) || '[]') // 作为一个数据变量 接收 搜索历史记录
    }
  },
  methods: {
    // 删除历史记录
    delHistory (index) {
      this.historyList.splice(index, 1) // 直接删除对应的历史记录
      localStorage.setItem(key, JSON.stringify(this.historyList))
    },
    // 点击历史记录跳转
    toSearchResult (item) {
      this.$router.push({
        path: '/search/result', // 需要传递查询参数 查询的是什么
        query: { q: item }
      })
    },
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
