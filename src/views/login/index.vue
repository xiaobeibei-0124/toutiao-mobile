<template>
  <div>
   <div class="container">
      <van-nav-bar title="登录" left-arrow @click-left="$router.back()"></van-nav-bar>
      <!-- 登录布局 -->
      <van-cell-group>
        <van-field label="手机号" placeholder="请输入手机号" v-model.trim="loginForm.mobile" :error-message="errorMessage.mobile" @blur="checkMobile"></van-field>
        <van-field label="验证码" placeholder="请输入验证码" v-model.trim="loginForm.code" :error-message="errorMessage.code" @blur="checkCode">
          <van-button slot="button" size="small" type="primary">发送验证码</van-button>
        </van-field>
      </van-cell-group>
      <!-- 登录按钮 -->
      <div class="login-box">
        <van-button type="info" size="small" block round @click="login">登录</van-button>
      </div>
   </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 接收表单数据
      loginForm: {
        mobile: '',
        code: ''
      },
      errorMessage: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    checkMobile () {
      if (!this.loginForm.mobile) {
        this.errorMessage.mobile = '电话号码不能为空'
        return false // 走到这里就不用了在往下验证了直接false结束
      }
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errorMessage.mobile = '电话号码输入有误'
        return false
      }
      this.errorMessage.mobile = '' // 进到这里说明验证通过 将错误提示置为空
      return true
    },
    checkCode () {
      if (!this.loginForm.code) {
        this.errorMessage.code = '验证码不能为空'
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errorMessage.code = '验证码输入有误'
        return false
      }
      this.errorMessage.code = ''
      return true
    },
    // 点击登录校验
    login () {
      const Mobile = this.checkMobile()
      const Code = this.checkCode()
      if (Mobile && Code) {
        console.log('校验成功')
      }
    }
  }
}
</script>

<style lang='less' scoped>
.login-box {
  padding: 20px;
}

</style>
