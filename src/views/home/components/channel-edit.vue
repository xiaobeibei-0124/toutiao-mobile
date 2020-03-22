<template>
  <div class="channel-edit">
    <div class="channel">
      <!-- 标题 -->
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <!-- 我的频道： -->
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,index) in channels" :key="item.id">
          <span class="f12" :class="{red: index===activeIndex}" @click="$emit('selectChannel',index)">{{item.name}}</span>
          <!-- 第一个频道不允许修改 index！==0 修改模式下显示插好 editing -->
          <van-icon @click="$emit('delChannels',item.id)" class="btn" name="cross" v-if="index !==0 && editing"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 可选频道： -->
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionalChannels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <van-icon @click="$emit('addChannel',item)" class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels'
export default {
  data () {
    return {
      editing: false,
      allChannels: []
    }
  },
  // 接收父组件传递进来的值,可以直接用
  props: {
    channels: {
      required: true,
      type: Array,
      default: () => []
    },
    activeIndex: {
      required: true,
      type: Number,
      default: 0
    }
  },
  methods: {
    async getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels
    }
  },
  // 用计算属性 可选频道 其实是一个动态的结果  全部数据(data) - 用户频道(props) => 重新计算频道数据 => 缓存
  computed: {
    // 一个方法，方法必须有返回值
    optionalChannels () {
      // filter 过滤器 里面是过滤器的方法 谁调用item就是谁的值
      // some(fun) 检测数组中是否有满足条件的 里面的方法就是条件
      // return 总频道 筛选 ！我的频道中(我的频道id===总频道id)
      return this.allChannels.filter(item => !this.channels.some(o => o.id === item.id))
    }
  },
  created () {
    this.getAllChannels()
  }

}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
