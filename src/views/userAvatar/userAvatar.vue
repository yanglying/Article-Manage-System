<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <!-- //若当前用户没有设置头像，则使用默认的 -->
      <!-- <img
        class="the_img"
        src="../../assets/images/pic.png"
        v-if="$store.state.first_login_art"
        alt=""
      /> -->
      <img class="the_img" v-if="!avatar" :src="oldAvatar" alt="" />
      <img class="the_img" v-else :src="avatar" alt="" />

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input
          type="file"
          accept="image/*"
          style="display: none"
          ref="img"
          @change="onFileChange"
        />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg"
          >选择图片</el-button
        >
        <el-button
          type="success"
          icon="el-icon-upload"
          :disabled="avatar === ''"
          @click="uploadFun"
          >上传头像</el-button
        >
      </div>
    </div>
  </el-card>
</template>

<script>
import { updateAvatarAPI } from "@/api";
export default {
  name: "UserAvatar",
  data() {
    return {
      avatar: "",
      picDefalut: "../../assets/images/pic.png",
      oldAvatar: this.$store.state.userInfo.avatar,
    };
  },
  methods: {
    // 选择图片->点击事件->让选择框出现
    chooseImg() {
      // 模拟点击行为
      this.$refs.img.click();
    },

    onFileChange(e) {
      // 获取用户选择的文件列表（伪数组）
      const files = e.target.files;
      if (files.length === 0) {
        this.avatar = "";
      } else {
        const fr = new FileReader();
        // 调用 readAsDataURL 函数，读取文件内容
        fr.readAsDataURL(files[0]);
        fr.onload = (e) => {
          // 4. 通过 e.target.result 获取到读取的结果，
          // 值是字符串（base64 格式的字符串）
          this.avatar = e.target.result;
        };
      }
    },
    //
    async uploadFun() {
      const res = await updateAvatarAPI(this.avatar);
      console.log(res);
      if (res.data.code !== 0) {
        this.$message.error("上传头像失败！");
      } else {
        this.$message.success("上传头像成功！");
      }
      // 并更新store中的数据
      this.$store.dispatch("updataAvatar", this.avatar);
    },
  },
};
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
}
.the_img {
  width: 350px;
  height: 350px;
}
</style>
