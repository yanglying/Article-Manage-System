<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题的盒子 -->
      <div class="title-box">文章后台管理系统</div>
      <!-- 注册的表单区域 -->
      <el-form :model="regForm" :rules="regRules" ref="regRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="regForm.username"
            placeholder="请输入用户名"
            class="input"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="regForm.password"
            type="password"
            placeholder="请输入密码"
            class="input"
          ></el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item prop="repassword">
          <el-input
            v-model="regForm.repassword"
            type="password"
            placeholder="请再次确认密码"
            class="input"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-reg" @click="regFun"
            >注册</el-button
          >
          <el-link
            type="info"
            @click="$router.push('/login')"
            style="color: white"
            >去登录</el-link
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { registerAPI } from "../../api/index.js";
export default {
  name: "my-register",
  data() {
    const samePwd = (rule, value, callback) => {
      if (value !== this.regForm.password) {
        // 如果验证失败，则调用 回调函数时，指定一个 Error 对象。
        callback(new Error("两次输入的密码不一致!"));
      } else {
        // 如果验证成功，则直接调用 callback 回调函数即可。
        callback();
      }
    };
    return {
      // 注册表单的数据对象
      regForm: {
        username: "",
        password: "",
        repassword: "",
      },
      // 注册表单的验证规则对象
      regRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: "用户名必须是1-10的大小写字母数字",
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
        repassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          {
            pattern: /^\S{6,15}$/,
            message: "密码必须是6-15的非空字符",
            trigger: "blur",
          },
          { validator: samePwd, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    regFun() {
      this.$refs.regRef.validate(async (vaild) => {
        if (vaild) {
          // 收集到表单数据
          const res = await registerAPI(this.regForm);
          console.log(res);
          // elementui 在vue上设置的弹窗效果
          if (res.data.code !== 0) return this.$message.error(res.data.msg);
          if (res.data.code === 0) {
            this.$message.success(res.data.msg);
            this.$router.push("/login");
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
.reg-container {
  background: url("../../assets/images/img-2.jpg") center;
  background-size: cover;
  height: 100%;

  .reg-box {
    width: 400px;
    height: 340px;

    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 10px 30px;
    box-sizing: border-box;
    ::v-deep .input .el-input__inner {
      color: white;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 30px;
    }
    .title-box {
      text-align: center;
      font-size: 25px;
      padding: 10px 0;
      color: white;
    }

    .btn-reg {
      width: 100%;
    }
  }
}
</style>
