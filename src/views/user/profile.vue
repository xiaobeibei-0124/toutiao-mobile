<template>
  <div class="container">
    <van-nav-bar @click-right="saveUser" left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存"></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          @click="showPhoto=true"
          round
          :src="user.photo"
        />
      </van-cell>
      <van-cell is-link @click="showName=true" title="名称" :value="user.name" />
      <van-cell is-link @click="showGender=true" title="性别" :value="user.gender===0 ? '男' : '女'" />
      <van-cell is-link @click="showDate" title="生日" :value="user.birthday" />
    </van-cell-group>

    <!-- 头像弹层组件 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
       <van-cell @click="openFileDialog" is-link title="本地相册选择图片"></van-cell>
       <van-cell is-link title="拍照"></van-cell>
    </van-popup>

    <!-- 昵称弹层组件 -->
    <van-popup v-model="showName" style="width:80%" :close-on-click-overlay='false'>
       <!-- 编辑用户昵称  双向绑定用户的昵称-->
       <van-field :error-message='nameMsg' v-model.trim="user.name" type='textarea'  rows="4"></van-field>
       <van-button block type="info" size="normal" @click="btnName">确定</van-button>
    </van-popup>

    <!-- 性别弹层组件 -->
    <van-action-sheet @select="selectItem" :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>

    <!-- 生日弹层组件 -->
    <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <van-datetime-picker
           v-model="currentDate"
           type="date"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="confirmDate"
          @cancel="showBirthDay=false"
         />
    </van-popup>

    <!-- 文件选择控件 -->
    <input ref="myFile" @change="upload()" type="file" style="display:none">
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile, updatePhoto, saveUserInfo } from '@/api/user'
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
    // 昵称规则
    btnName () {
      // 对输入的文字进行验证1-7为
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        this.nameMsg = '用户昵称的长度应该是1-7的长度要求'
        return
      }
      this.nameMsg = ''// 将错误信息清空
      this.showName = false // 关闭弹窗
    },
    // 性别选择
    selectItem (item, index) {
      // index 0 男 1 女
      this.user.gender = index
      this.showGender = false
    },
    // 生日选择
    showDate () {
      this.showBirthDay = true
      // 日期弹层要求date格式 传入的值是字符串 先要处理一下 转为date格式
      this.currentDate = new Date(this.user.birthday)
    },
    confirmDate () {
      //  当前选择的生日 其实就是 currenDate
      // 拿到选择的日期  设置给生日  => date  => 字符串
      this.user.birthday = dayjs(this.currentDate).format('YYYY-MM-DD') // 将date类型转化成字符串
      this.showBirthDay = false
    },
    // 获取用户信息
    async getUserProfile () {
      this.user = await getUserProfile()
    },
    // 打开选择文件的对话框 触发点击input:file的动作
    openFileDialog () {
      this.$refs.myFile.click() // 触发input:file的click事件 触发事件就会弹出文件对话框
    },
    // 修改更新头像接口
    async upload () {
      const data = new FormData()
      data.append('photo', this.$refs.myFile.files[0]) // 第二个参数 是 选择的图片文件 选择图片文件
      const result = await updatePhoto(data)
      this.user.photo = result.photo
      this.showPhoto = false
    },
    // 保存修改信息
    async saveUser () {
      try {
        await saveUserInfo(this.user) // 传入user对象
        this.$gnotify({ type: 'success', message: '保存成功' })
      } catch (error) {
        this.$gnotify({ message: '保存失败' })
      }
    }
  },
  created () {
    this.getUserProfile()
  }

}
</script>

<style>
</style>
