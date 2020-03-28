<template>
  <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存"></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
      </van-cell>
      <van-cell is-link @click="showName=true" title="名称" :value="user.name" />
      <van-cell is-link title="性别" value="男" />
      <van-cell is-link title="生日" value="2019-08-08" />
    </van-cell-group>

    <!-- 头像弹层组件 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
       <van-cell is-link title="本地相册选择图片"></van-cell>
       <van-cell is-link title="拍照"></van-cell>
    </van-popup>

    <!-- 昵称弹层组件 -->
    <van-popup v-model="showName" style="width:80%" :close-on-click-overlay='false'>
       <!-- 编辑用户昵称  双向绑定用户的昵称-->
       <van-field :error-message='nameMsg' v-model.trim="user.name" type='textarea'  rows="4"></van-field>
       <van-button block type="info" size="normal" @click="btnName">确定</van-button>
    </van-popup>

    <!-- 性别弹层组件 -->
    <van-action-sheet :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>

    <!-- 生日弹层组件 -->
    <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <van-datetime-picker
           v-model="currentDate"
           type="date"
          :min-date="minDate"
          :max-date="maxDate"
         />
    </van-popup>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 定义四个变量用于控制4个弹层的隐藏显示
      showPhoto: false, // 显示头像弹层:
      showName: false, // 显示昵称弹层
      showGender: false, // 显示性别弹层
      showBirthDay: false, // 控制生日弹层
      // 定义性别和生日数据
      actions: [{ name: '男' }, { name: '女' }],
      minDate: new Date(1900, 1, 1), // 最小时间
      maxDate: new Date(), // 生日最大时间 永远是小于等于当前时间的
      currentDate: new Date(), // 现在时间
      nameMsg: '', // 错误信息
      // 定义user数据储存接收用户信息
      user: {
        name: '',
        gender: 1,
        birthday: '',
        photo: ''
      }
    }
  },
  methods: {
    btnName () {
      // 对输入的文字进行验证1-7为
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        this.nameMsg = '用户昵称的长度应该是1-7的长度要求'
        return
      }
      this.nameMsg = ''// 将错误信息清空
      this.showName = false // 关闭弹窗
    }
  }
}
</script>

<style>
</style>
