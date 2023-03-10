<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>重置密码</span>
    </div>
    <!-- 表单 -->
    <el-form
      :model="pwdForm"
      :rules="pwdFormRules"
      ref="pwdFormRef"
      label-width="100px"
    >
      <el-form-item label="原密码" prop="old_pwd">
        <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="re_pwd">
        <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updatePwdFn">修改密码</el-button>
        <el-button @click="resetFn">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { updatePwdAPI } from "@/api";
export default {
  name: "UserPwd",
  data() {
    return {
      // 表单的数据对象
      pwdForm: {
        old_pwd: "",
        new_pwd: "",
        re_pwd: "",
      },
      // 表单的验证规则对象
      pwdFormRules: {
        old_pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^\S{6,15}$/,
            message: "密码长度必须是6-15位的非空字符串",
            trigger: "blur",
          },
        ],
        new_pwd: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            pattern: /^\S{6,15}$/,
            message: "密码长度必须是6-15位的非空字符串",
            trigger: "blur",
          },
        ],
        re_pwd: [
          { required: true, message: "请再次确认新密码", trigger: "blur" },
          {
            pattern: /^\S{6,15}$/,
            message: "密码长度必须是6-15位的非空字符串",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 重置按钮->点击事件
    resetFn() {
      this.$refs.pwdFormRef.resetFields();
    },
    updatePwdFn() {
      this.$refs.pwdFormRef.validate(async (valid) => {
        if (!valid) return false; // 未通过校验拦住
        console.log(this.pwdForm);
        const res = await updatePwdAPI(this.pwdForm);
        console.log(res);
        if (res.data.code !== 0) return this.$message.error(res.data.msg);
        else {
          this.$message.success("密码更新成功！请重新登录");
          this.$router.push("/login");
        }
        // 密码修改完毕之后将 表单值清空
        this.$refs.pwdFormRef.resetFields();
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-form {
  width: 350px;
}
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
