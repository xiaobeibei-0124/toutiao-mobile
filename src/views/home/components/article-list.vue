<template>
  <!-- 文章列表组件  放置列表 -->
  <!-- van-list 可以帮助我们实现上拉加载  需要一些变量 -->
  <!-- 这里放置这个div的目的是 形成滚动条, 因为我们后期要做 阅读记忆 -->
  <!-- 阅读记忆  上次你阅读到哪  回来之后还是哪-->
  <div class="scroll-wrapper">
    <!-- load 滚动条与底部距离小于offset (300px) 时触发 -->
    <van-list v-model="upLoading" :finished="finished" @load="onLoad"></van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      upLoading: false, // 表示是否开启了上拉加载 默认值false
      finished: false // 表示 是否已经完成所有数据的加载
    }
  },
  methods: {
    onLoad () {
      // 下面这么写 依然不能关掉加载状态 为什么 ? 因为关掉之后  检测机制  高度还是不够 还是会开启
      // 如果你有数据 你应该 把数据到加到list中
      // 如果想关掉
      setTimeout(() => {
        this.finished = true // 标识数据全部加载完毕
      }, 1000) // 等待一秒 然后关闭加载状态
    }
  }

}
</script>

<style>

</style>
