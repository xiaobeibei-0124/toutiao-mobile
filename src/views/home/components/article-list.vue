<template>
  <!-- 文章列表组件  放置列表 -->
  <!-- van-list 可以帮助我们实现上拉加载  需要一些变量 -->
  <!-- 这里放置这个div的目的是 形成滚动条, 因为我们后期要做 阅读记忆 -->
  <!-- 阅读记忆  上次你阅读到哪  回来之后还是哪-->
  <div class="scroll-wrapper">
    <!-- load 滚动条与底部距离小于offset (300px) 时触发 -->
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="successText">
      <van-list v-model="upLoading" :finished="finished" @load="onLoad" finished-text="加载完毕">
        <van-cell-group>
          <van-cell v-for="item in articles" :key="item.art_id.toString()">
            <div class="article_item">
              <h3 class="van-ellipsis">{{item.title}}</h3>
              <!-- 三图情况 -->
              <div class="img_box" v-if="item.cover.type === 3">
                <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <!-- 单图情况 -->
              <div class="img_box" v-if="item.cover.type === 1">
                <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>
              <div class="info_box">
                <span>{{item.aut_name}}</span>
                <span>{{item.comm_count}}条评论</span>
                <span>{{item.pubdate}}</span>
                <span class="close">
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 引入获取文章电泳接口方法
import { getArticles } from '@/api/articles'
export default {
  data () {
    return {
      successText: '', // 刷新成功显示的提示
      downLoading: false, // 表示下拉刷新加载
      upLoading: false, // 表示是否开启了上拉加载 默认值false
      finished: false, // 表示 是否已经完成所有数据的加载
      articles: [], // 用来接收文章的数组
      timestamp: null // 定义一个时间戳属性 用来存储 历史时间戳
    }
  },
  // 父组件传递进来的文章id值
  props: {
    // key(props属性名): value(对象 配置)
    channel_id: {
      required: true, // 此项为true 说明必须传入参数
      type: Number, // 确定传入的数据类型
      default: null // 默认值的意思 假如你没有传入 prop属性 默认值 就会被采用
    }
  },
  methods: {
    // 上拉加载方法
    async onLoad () {
      const data = await getArticles({
        channel_id: this.channel_id,
        timestamp: this.timestamp || Date.now() // 如果有历史事件戳用历史，没有用现在
      })
      // 每次加载完毕追加数据
      this.articles.push(...data.results)
      // 关闭加载状态
      this.upLoading = false
      // 判断历史时间戳是否为0 为0 则开始finish 不为0 传递给data
      if (data.pre_timestamp) {
        this.timestamp = data.pre_timestamp
      } else {
        this.finished = true
      }

      // 下面这么写 依然不能关掉加载状态 为什么 ? 因为关掉之后  检测机制  高度还是不够 还是会开启
      // 如果你有数据 你应该 把数据到加到list中
      // 如果想关掉
      // setTimeout(() => {
      //   this.finished = true // 标识数据全部加载完毕
      // }, 1000) // 等待一秒 然后关闭加载状态
      // console.log('开始加载')
      // Array.from()方法就是将一个类数组对象或者可遍历对象转换成一个真正的数组。
      // 将数据控制在50以内
      // if (this.articles.length > 50) {
      //   this.finished = true // 关闭加载
      // } else {
      //   const arr = Array.from(
      //     Array(15),
      //     (value, index) => this.articles.length + index + 1
      //   )
      //   this.articles.push(...arr)
      //   this.upLoading = false
      // }
    },
    // 下拉刷新方法
    async onRefresh () {
      const data = await getArticles({
        channel_id: this.channel_id,
        timestamp: Date.now() // 永远传最新的时间戳，获取新数据
      })
      this.downLoading = false
      // 判断最新的时间戳是否能换回新的数据
      if (data.results.length) {
        this.articles = data.results // 直接用最新数据替换掉历史数据
        // 如果你拉倒最下边没有历史数据了 有向上刷新 新加载的数据后有新的历史事件戳
        // 需要手动吧打开的关闭上拉加载关掉 将新的历史事件戳重新赋值
        if (data.pre_timestamp) {
          this.finished = false
          this.timestamp = data.pre_timestamp
        }
        this.successText = `更新了${data.results.length}条数据`
      } else {
        this.successText = '当前已经是最新数据了'
      }

      // setTimeout(() => {
      //   const arr = Array.from(
      //     Array(2),
      //     (value, index) => '追加' + (index + 1)
      //   )
      //   this.articles.unshift(...arr)
      //   this.downLoading = false
      //   this.successText = `更新了${arr.length}条数据`
      // }, 1000)
    }
  }
}
</script>

<style lang='less' scoped>
.article_item{
  h3{
    font-weight: normal;
    line-height: 2;
  }
  .img_box{
    display: flex;
    justify-content: space-between;
    .w33{
      width: 33%;
      height: 90px;
    }
    .w100{
      width: 100%;
      height: 180px;
    }
  }
  .info_box{
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span{
      padding-right: 10px;
      &.close{
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
