<template>
  <div class="comment">
    <!-- 评论组件 -->
    <van-list v-model="loading" :finished="finished" @load="onLoad" finished-text="没有更多了">
      <div class="item van-hairline--bottom van-hairline--top" v-for="comment in comments" :key="comment.com_id.toString()">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="comment.aut_photo"
        />
        <div class="info">
          <p>
            <span class="name">{{comment.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{comment.like_count}}</span>
            </span>
          </p>
          <p>{{comment.content}}</p>
          <p>
            <span class="time">{{comment.pubdate | relTime}}</span>&nbsp;
            <van-tag plain @click="openReply(comment.com_id.toString())">{{comment.reply_count}} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 输入评论框 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button" @click="submit">提交</span>
      </van-field>
    </div>
     <!-- 评论的回复评论列表 -->
     <!-- 在关闭回复弹窗的时候把reply.commentid置为null 以便于区分是对文章评论还是回复评论 -->
    <van-action-sheet v-model="showReply" :round="false" @closed='reply.commentId=null' class="reply_dialog" title="回复评论">
      <!-- 关闭第一次默认加载 -->
      <van-list @load="getReply" :immediate-check="false" v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <div class="item van-hairline--bottom van-hairline--top" v-for="item in reply.list" :key="item.com_id.toString()">
          <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
          <div class="info">
            <p><span class="name">{{item.aut_name}}</span></p>
            <p>{{item.content}}</p>
            <p><span class="time">{{ item.pubdate | relTime }}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import { getComments, commentOrReply } from '@/api/articles'
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      comments: [], // 用来存放评论列表的数据
      offset: null, // 表示分页依据 如果为空,表示从第一页开始
      showReply: false, // 控制评论的评论面板是否显示
      // 此对象专门放置 面板加载信息
      reply: {
        loading: false, // 评论的评论的加载状态
        finished: false, // 评论的评论是否加载完毕
        offset: null, // 偏移量 作为评论的评论分页加载的时候 查询的依据
        list: [], // 存放 评论的评论的数据
        commentId: null // 评论id
      }
    }
  },
  methods: {
    // 打开评论的回复评论列表
    openReply (commentId) {
      this.showReply = true // 打开
      // 处理
      this.reply.commentId = commentId
      // 在弹出面板的时候 重置数据
      //  弹出窗口之前  把之前的list清空  重置数据
      this.reply.list = []
      this.reply.offset = null // 点击评论的时候是新的数据，所有数据重置
      this.reply.finished = false
      this.reply.loading = true
      // 手动关掉主动请求就要手动打开
      this.getReply() // 弹出评论的评论的层时 主动的去请求一次数据
    },
    // 获取回复评论的内容
    async getReply () {
      const data = await getComments({
        type: 'c',
        source: this.reply.commentId,
        offset: this.reply.offset
      })
      this.reply.list.push(...data.results)
      this.reply.loading = false
      this.reply.finished = data.end_id === data.last_id
      if (!this.reply.finished) {
        this.reply.offset = data.last_id
      }
    },
    // 获取评论内容
    async onLoad () {
      const { artId } = this.$route.query
      const data = await getComments({
        type: 'a',
        source: artId,
        offset: this.offset
      })
      // 获取回来插入到评论后边
      this.comments.push(...data.results)
      this.loading = false
      // 判断是否还有下一页
      this.finished = data.end_id === data.last_id
      if (!this.finished) {
        // 表示 还没没结束
        // data.last_id是 当前页的最后一个id
        this.offset = data.last_id
      }
    },
    // 点击提交发布评论or回复评论
    async submit () {
      // 首先验证用户是否登录，游客是无法评论的，是否有token值
      if (this.$store.state.user.token) {
        // 判断输入的值是否为空
        if (!this.value) return false // 为空直接返回
        // 如果有内容，先把提交状态打开，避免重复提交
        this.submiting = true
        await this.$sleep(800) // 强制休眠800毫秒
        // 调用接口
        try {
          const data = await commentOrReply({
          // 看是否有评论id 有的话就是恢复评论 传评论id 没有传文章id 文章id在路径中
            target: this.reply.commentId ? this.reply.commentId : this.$route.query.artId,
            content: this.value,
            art_id: this.reply.commentId ? this.$route.query.artId : null
          })
          // 会有两种状态 对文章评论 恢复评论
          if (this.reply.commentId) {
            // 对评论进行评论
            this.reply.list.unshift(data.new_obj)
            // 评论数+1 找到对应的评论 comments评论列表 reply恢复评论
            const comment = this.comments.find(item => item.com_id.toString() === this.reply.commentId)
            comment && comment.reply_count++
          } else {
            // 对文章进行评论
            this.comments.unshift(data.new_obj)
          }
          this.value = ''
        } catch (error) {
          this.$gnotify({
            message: '评论失败'
          })
        }
        this.submiting = false // 关闭提交状态
      } else {
        // 没有登录
        // 弹窗告知用户要登录才能评论 confirm支持promise格式 可以用try catch
        try {
          await this.$dialog.confirm({
            message: '如果想要评论消息，请先登录'
          })
          // 点击确定跳到登录页面
          this.$router.push({
            path: '/login',
            // 携带当前所停留的页面地址，登陆之后直接跳转到该地址
            query: {
              redireUrl: this.$route.fullpath // 完整地址 path是不带后面参数的，所以这里用完整地址
            }
          })
        } catch (error) {
          console.log('点击了取消')
        }
      }
    }
  }
}
</script>

<style lang='less' scoped>
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
</style>
