<template>
  <div class='container'>
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate | relTime}}</p>
        </div>
        <van-button round size="small" type="info" @click="follow" :loading="followLoading">{{article.is_followed ? '已关注' :  '+关注'}}</van-button>
      </div>
      <div class="content" v-html="article.content">
        <!-- 文章内容 有标签 有属性 有样式 将标签设置到对应的元素中 v-html -->
        <!-- <p>文章的内容</p> -->
      </div>
      <div class="zan">
        <van-button round size="small" :class="{active:article.attitude===1}" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" :class="{active:article.attitude===0}" plain icon="delete">不喜欢</van-button>
      </div>
    </div>
    <!-- 放置一个遮罩层 -->
    <van-overlay :show="loading">
      <!-- 加载进度条 -->
      <div class='loading-container'>
         <van-loading />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { getArticleInfo } from '@/api/articles'
import { followUser, unfollowUser } from '@/api/user'
export default {
  data () {
    return {
      article: {}, // 获取文章
      loading: false, // 遮罩层状态
      followLoading: false // 是否正在点击关注
    }
  },
  methods: {
    async getArticleInfo () {
      this.loading = true
      const { artId } = this.$route.query // 结构查询id
      this.article = await getArticleInfo(artId)
      this.loading = false
    },
    // 点击关注按钮
    async follow () {
      this.followLoading = true
      try {
        // 看返回是否关注
        if (this.article.is_followed) {
          await unfollowUser(this.article.aut_id)
        } else {
          await followUser({ target: this.article.aut_id })
        }
        // 如果成功了
        // pc端 是 重新加载
        // 移动端 不会重新加载 只会修改对应的数据状态
        this.article.is_followed = !this.article.is_followed
        this.$gnotify({ type: 'success', message: '修改成功' })
      } catch (error) {
        this.$gnotify({ message: '操作失败' })
      } finally {
        //  不论你写的执行 是成功的还是失败的  不论是走 try  catch 最终都会进入 finally
        this.followLoading = false // 关闭加载状态
      }
    }
  },
  created () {
    this.getArticleInfo()
  }
}
</script>

<style lang='less' scoped>
.loading-container{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.van-overlay {
  background: none;
}
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position:sticky;
    background-color: #fff;
    top:46px;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}

</style>
