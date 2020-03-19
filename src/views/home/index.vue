<template>
  <div class="container">
    <!-- 标签区域 -->
   <van-tabs>
     <van-tab v-for="item in channels" :key="item.id" :title="item.name">
       <!-- 放入cell单元格 -->
       <!-- <div class="scroll-wrapper">
        <van-cell-group>
          <van-cell title="标题" value="内容" v-for="item in 20" :key="item"></van-cell>
        </van-cell-group>
       </div> -->
       <ArticleList :channel_id='item.id'></ArticleList>
     </van-tab>
   </van-tabs>
   <!-- 在tabs下放置图标  编辑频道的图标 -->
   <span class="bar_btn">
     <van-icon name='wap-nav' />
   </span>
  </div>
</template>

<script>
// 引入列表组件并注册
import ArticleList from './components/article-list'
import { getChannels } from '@/api/channels'
export default {
  components: {
    ArticleList
  },
  data () {
    return {
      channels: [] // 接收频道数据
    }
  },
  methods: {
    // 自定义的方法 获取频道列表
    async getChannels () {
      // 调接口获取频道列表
      const data = await getChannels()
      this.channels = data.channels
    }
  },
  created () {
    this.getChannels()
  }
}
</script>

<style lang='less' scoped >
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
