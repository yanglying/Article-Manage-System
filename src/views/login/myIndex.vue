<template>
  <!-- 登录页面的整体盒子 -->
  <div class="login-container">
    <!-- 登录的盒子 -->
    <div class="login-box">
      <!-- 标题的盒子 -->
      <div class="title-box">
        <span style="color: white; font-size: 22px">文章后台管理系统</span>
      </div>
      <!-- 登录的表单区域 -->
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginRef"
        class="form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            maxlength="10"
            minlength="2"
            class="input"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            maxlength="15"
            minlength="6"
            class="input"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="loginFn"
            >登录</el-button
          >
          <el-link
            type="info"
            @click="$router.push('/reg')"
            style="color: white"
            >注册</el-link
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { loginAPI } from "../../api/index.js";
import { showTime } from "../../utils/functions.js";
export default {
  name: "my-login",
  data() {
    return {
      // 登录表单的数据对象
      loginForm: {
        username: "",
        password: "",
      },
      // 登录表单的验证规则对象
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: "用户名必须是1-10的字母数字",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^\S{6,15}$/,
            message: "密码必须是6-15的非空字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    ...mapMutations(["updateUid", "updateUserInfo"]),
    loginFn() {
      this.$refs.loginRef.validate(async (vaild) => {
        if (vaild) {
          // 首先判断表单登录的用户密码是否符合校验规则
          const res = await loginAPI({
            ...this.loginForm,
            last_login: showTime(),
          });

          // 判断登录是否成功
          if (res.data.code === 0) {
            console.log(res.data.personMsg);
            // 登录成功显示 消息提示，
            // 登录成功之后返回来当前用户的所有数据保存在store中
            this.$message.success(res.data.msg);
            this.$store.commit("updataToken", res.data.token);
            this.$store.dispatch("initUserInfo", res.data.personMsg);
            this.$router.push("/");
          } else {
            return this.$message.error(res.data.msg);
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  background: url("../../assets/images/img-2.jpg") center;
  background-size: cover;
  height: 100%;

  .login-box {
    width: 400px;
    height: 270px;

    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 30px;
    box-sizing: border-box;
    ::v-deep .input .el-input__inner {
      color: white;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 30px;
    }
    .title-box {
      text-align: center;
      font-size: 26px;
      padding: 10px 0;
    }

    .btn-login {
      width: 100%;
    }
  }
}
</style>
