<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>基本资料</span>
    </div>
    <div class="text item">
      <el-form
        :model="userFormData"
        :rules="rules"
        ref="userFormData"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="登录名称" prop="username">
          <el-input
            type="text"
            v-model="userFormData.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="用户昵称" prop="nickname">
          <el-input
            v-model="userFormData.nickname"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="userFormData.email"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">提交修改</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { upDataAPI } from "../../api/index.js";
export default {
  data() {
    return {
      userFormData: {
        username: this.$store.state.userInfo.username,
        nickname: "",
        email: "",
      },
      // 表单的验证规则对象
      rules: {
        nickname: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
          {
            pattern: /^\S{1,10}$/,
            message: "昵称必须是1-10位的非空字符串",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          { type: "email", message: "邮箱格式不正确", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.userFormData.nickname = this.$store.state.userInfo.nickname;
    this.userFormData.email = this.$store.state.userInfo.email;
  },
  methods: {
    submitForm() {
      this.$refs.userFormData.validate(async (vaild) => {
        if (vaild) {
          const res = await upDataAPI(
            this.userFormData.nickname,
            this.userFormData.email
          );
          console.log(res);
          if (res.data.code === 0) {
            this.$store.commit("updateUserInfo", this.userFormData); // 更新store
            this.$message({
              type: "success",
              message: "更新成功!",
            });
          }
        } else {
          this.$message({
            type: "error",
            message: "提交失败！请检查修改信息是否合规！",
          });
          return false;
        }
      });
    },
    resetForm() {
      this.userFormData.nickname = "";
      this.userFormData.email = "";
    },
  },
};
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 90%;
}
</style>
