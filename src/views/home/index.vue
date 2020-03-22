<template>
  <div class="container">
    <!-- 标签区域 -->
   <van-tabs v-model="activeIndex">
     <van-tab v-for="item in channels" :key="item.id" :title="item.name">
       <!-- 放入cell单元格 -->
       <!-- <div class="scroll-wrapper">
        <van-cell-group>
          <van-cell title="标题" value="内容" v-for="item in 20" :key="item"></van-cell>
        </van-cell-group>
       </div> -->
       <!-- 监听子组件点击事件，打开不感兴趣弹窗 -->
       <ArticleList :channel_id='item.id' @showAction='openAction'></ArticleList>
     </van-tab>
   </van-tabs>
   <!-- 在tabs下放置图标  编辑频道的图标 -->
   <span class="bar_btn" @click="showChannelEdit=true">
     <van-icon name='wap-nav' />
   </span>
   <!-- 引入more-action组件 -->
   <!-- 弹层显示 -->
   <van-popup v-model="showmoreAction" style="width:80%">
      <!-- 不喜欢文章 和 举报文章 用一个方法 -->
      <!-- @事件名="方法名"  @事件名="方法名()" @事件名="方法名($event 参数)" @事件名="逻辑" -->
      <!-- $event 是事件参数 在h5标签中 dom元素的事件参数  自定义事件中$event 就是自定义事件传出的第一个参数 -->
     <moreAction @dislike="dislikeOrReport('dislike')" @report="dislikeOrReport('report',$event)"></moreAction>
   </van-popup>
   <!-- 频道组件 -->
   <!-- 引入上拉菜单 -->
   <van-action-sheet v-model="showChannelEdit" title="编辑频道" :round="false">
     <channelEdit></channelEdit>
   </van-action-sheet>
  </div>
</template>

<script>
// 引入列表组件并注册
import ArticleList from './components/article-list'
import moreAction from './components/more-action'
import { getChannels } from '@/api/channels'
// 引入文章不感兴趣接口
import { disLike, reportArticle } from '@/api/articles'
// 引入事件广播，触发文章不感兴趣接口后开始广播
import eventBus from '@/utils/eventbus'
import channelEdit from './components/channel-edit'
export default {
  components: {
    ArticleList,
    moreAction,
    channelEdit
  },
  data () {
    return {
      channels: [], // 接收频道数据
      showmoreAction: false,
      articleId: null, // 默认文章id为null
      activeIndex: 0, // 默认分类标签为0
      showChannelEdit: false // 显示频道组件
    }
  },
  methods: {
    // 自定义的方法 获取频道列表
    async getChannels () {
      // 调接口获取频道列表
      const data = await getChannels()
      this.channels = data.channels
    },
    // 显示不感兴趣弹层
    openAction (artId) {
      this.showmoreAction = true
      // 存储文章id 进行后续操作
      this.articleId = artId
    },
    // 对文章不感兴趣
    // operateType 是操作类型 如果是dislike 就是不喜欢 如果是 report 就是 举报
    async dislikeOrReport (operateType, type) {
      try {
        // 需要根据一个参数来判断 是举报还是不喜欢
        operateType === 'dislike' ? await disLike({
          target: this.articleId
        }) : await reportArticle({
          target: this.articleId,
          type //  这里的type怎么办 ?????? 通过$event传出来
        })
        this.$gnotify({
          type: 'success',
          message: '操作成功'
        })
        // 操作成功会进行事件广播
        // 广播时传递两个参数 点击的哪篇文章 处于哪个标签下
        // 文章：this.articleId 标签:this.channels[this.activeIndex].id
        eventBus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
        this.showmoreAction = false
      } catch (error) {
        this.$gnotify({
          message: '操作失败'
        })
      }
    }
  },
  created () {
    this.getChannels()
  }
}
</script>

<style lang='less' scoped >
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
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
