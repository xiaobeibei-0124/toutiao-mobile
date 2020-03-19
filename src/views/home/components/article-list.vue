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
          <van-cell v-for="item in articles" :key="item">
            <div class="article_item">
              <h3 class="van-ellipsis">PullRefresh下拉刷新PullRefresh下拉刷新下拉刷新下拉刷新</h3>
              <!-- 三图情况 -->
              <div class="img_box">
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              </div>
              <!-- 单图情况 -->
              <div class="img_box">
                <van-image class="w100" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              </div>
              <div class="info_box">
                <span>你像一阵风</span>
                <span>8评论</span>
                <span>10分钟前</span>
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
export default {
  data () {
    return {
      successText: '', // 刷新成功显示的提示
      downLoading: false, // 表示下拉加载
      upLoading: false, // 表示是否开启了上拉加载 默认值false
      finished: false, // 表示 是否已经完成所有数据的加载
      articles: [] // 用来接收文章的数组
    }
  },
  methods: {
    // 上拉加载方法
    onLoad () {
      // 下面这么写 依然不能关掉加载状态 为什么 ? 因为关掉之后  检测机制  高度还是不够 还是会开启
      // 如果你有数据 你应该 把数据到加到list中
      // 如果想关掉
      // setTimeout(() => {
      //   this.finished = true // 标识数据全部加载完毕
      // }, 1000) // 等待一秒 然后关闭加载状态
      // console.log('开始加载')
      // Array.from()方法就是将一个类数组对象或者可遍历对象转换成一个真正的数组。
      // 将数据控制在50以内
      if (this.articles.length > 50) {
        this.finished = true // 关闭加载
      } else {
        const arr = Array.from(
          Array(15),
          (value, index) => this.articles.length + index + 1
        )
        this.articles.push(...arr)
        this.upLoading = false
      }
    },
    // 下拉刷新方法
    onRefresh () {
      setTimeout(() => {
        const arr = Array.from(
          Array(2),
          (value, index) => '追加' + (index + 1)
        )
        this.articles.unshift(...arr)
        this.downLoading = false
        this.successText = `更新了${arr.length}条数据`
      }, 1000)
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
