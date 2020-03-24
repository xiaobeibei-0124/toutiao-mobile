<template>
  <div class="container">
    <!-- 导航 显示返回箭头-->
    <!-- click-left点击左侧事件 -->
    <!-- $router.go(-1) $router.back() -->
    <!-- 将 导航栏固定在顶部 -->
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()"></van-nav-bar>
    <!-- 防止搜索结果列表 -->
    <van-list v-model="uploading" @load='onLoad' :finished="finished">
      <van-cell-group>
        <van-cell :to="`/article?artId=${item.art_id.toString()}`" v-for="item in articles" :key="item.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{item.title}}</h3>
            <div class="img_box" v-if="item.cover.type===3">
              <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
            </div>
            <div class="img_box" v-if="item.cover.type===1">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{item.aut_name}}</span>
              <span>{{item.comm_count}}评论</span>
              <span>{{item.pubdate | relTime}}</span>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
import { searchArticle } from '@/api/articles'
export default {
  data () {
    return {
      articles: [], // 放置搜索结果文章的
      page: {
        page: 1, // 分页数据 第几页
        per_page: 10 // 每页几条
      },
      uploading: false, // 下拉刷新
      finished: false // 加载数据完成
    }
  },
  methods: {
    async onLoad () {
      // 获取传递的参数，搜索关键词
      const { q } = this.$route.query
      const data = await searchArticle({ ...this.page, q })
      // this.articles = data.results 错误 页面加载过程中 load就已经加载一次数据回来
      // 所以这是下拉过程中的数据，需要将获取的数据从后插入到列表中
      this.articles.push(...data.results)
      this.uploading = false // 关闭加载状态
      // 如何来判断 已经上拉加载 把所有的数据全都查询过来了?
      // 如果你返回的查询记录是 0 我此时认为 没有下一页的数据了
      if (data.results.length) {
        this.page.page++ // 有下一页，把页码切换到下一页 进行查询
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
