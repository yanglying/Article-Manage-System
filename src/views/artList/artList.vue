<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>文章列表</span>
      <el-button
        type="primary"
        size="small"
        class="btn-pub"
        style="margin-left: 85%"
        round
        @click="centerDialogVisible = true"
        >发表文章</el-button
      >
    </div>
    <div class="text item">
      <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        center
      >
        <span>需要注意的是内容是默认不居中的</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="centerDialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="selectData">
          <el-form-item label="文章分类">
            <el-select
              v-model="selectData.cate_name"
              placeholder="请选择分类"
              size="small"
            >
              <el-option
                v-for="item in cateList"
                :key="item.index"
                :label="item.cate"
                :value="item.cate"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 10px">
            <el-select
              v-model="selectData.state"
              placeholder="请选择状态"
              size="small"
            >
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
            <el-button
              type="primary"
              size="small"
              @click="onSubmit"
              round
              style="margin-left: 20px"
              >筛选</el-button
            >
            <el-button
              type="info"
              size="small"
              @click="reset"
              round
              style="margin-left: 15px"
              >重置</el-button
            >
          </el-form-item>
        </el-form>

        <el-dialog
          title="发布文章"
          :visible.sync="centerDialogVisible"
          width="45%"
          center
        >
          <el-form
            :label-position="labelPosition"
            label-width="100px"
            :model="formArtData"
          >
            <el-form-item label="文章分类">
              <el-select
                v-model="formArtData.cate_name"
                placeholder="请选择分类"
                size="small"
              >
                <el-option
                  v-for="item in cateList"
                  :key="item.index"
                  :label="item.cate"
                  :value="item.cate"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文章标题">
              <el-input v-model="formArtData.title"></el-input>
            </el-form-item>
            <el-form-item label="文章内容">
              <el-input v-model="formArtData.content"></el-input>
            </el-form-item>
            <el-form-item label="发布状态">
              <!-- 能够进行选择的表单 -->
              <el-select
                v-model="formArtData.state"
                placeholder="请选择发布状态"
                size="small"
              >
                <!-- //选项 -->
                <el-option label="已发布" value="已发布"></el-option>
                <el-option label="草稿" value="草稿"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文章封面">
              <div>
                <!-- 用来显示封面的图片 -->
                <img
                  src="../../assets/images/pic.png"
                  alt=""
                  class="cover-img"
                  ref="imgRef"
                />

                <!-- 按钮区域 -->
                <div class="btn-box">
                  <input
                    type="file"
                    style="display: none"
                    ref="iptRef"
                    @change="onFileChange"
                  />
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    @click="chooseImg"
                    >选择图片</el-button
                  >
                </div>
              </div>
            </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addArticle">确 定</el-button>
          </span>
        </el-dialog>
      </div>

      <!-- //下方选择排序按钮 -->
      <div class="click-select">
        <el-button
          type="success"
          size="small"
          @click="getList"
          round
          style="margin: 10px"
          >显示全部文章</el-button
        >
        <el-button
          type="success"
          size="small"
          round
          style="margin: 10px"
          @click="timeSort"
          >按时间排序</el-button
        >
        <el-button
          type="success"
          size="small"
          round
          style="margin: 10px"
          @click="likesSort"
          >按点赞数排序</el-button
        >
      </div>

      <br />
      <el-dialog
        title="编辑文章"
        :visible.sync="upArticleDialogVisible"
        width="37%"
        :before-close="handleClose"
      >
        <div>
          <el-form
            :label-position="labelPosition"
            label-width="90px"
            :model="updataArticle"
          >
            <el-form-item label="文章封面：">
              <div>
                <!-- 用来显示封面的图片 -->
                <img
                  :src="updataArticle.cover_img"
                  style="height: 120px; width: 120px; margin-right: 20px"
                  alt=""
                  class="cover-img"
                  ref="imgRef"
                />

                <!-- 按钮区域 -->
                <div class="btn-box">
                  <input
                    type="file"
                    style="display: none"
                    ref="iptRef"
                    @change="onFileChange"
                  />
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    @click="chooseImg"
                    >选择图片</el-button
                  >
                </div>
              </div>
            </el-form-item>

            <el-form-item label="文章标题：">
              <el-input v-model="updataArticle.title"></el-input>
            </el-form-item>

            <el-form-item label="文章分类：">
              <el-select
                v-model="updataArticle.cate_name"
                placeholder="请选择分类"
                size="small"
              >
                <el-option
                  v-for="item in cateList"
                  :key="item.index"
                  :label="item.cate"
                  :value="item.cate"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发布状态：">
              <el-select
                v-model="updataArticle.state"
                placeholder="请选择状态"
                size="small"
              >
                <el-option label="已发布" value="已发布"></el-option>
                <el-option label="草稿" value="草稿"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文章内容：">
              <el-input v-model="updataArticle.content"></el-input>
            </el-form-item>
            <el-form-item label="发布时间：">
              <span>{{ updataArticle.pub_date }}</span>
            </el-form-item>
            <el-form-item label="用户名称：">
              <span>{{ $store.state.userInfo.username }}</span>
            </el-form-item>
            <el-form-item label=" 用户昵称：">
              <span>{{ $store.state.userInfo.nickname }}</span>
            </el-form-item>
          </el-form>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="upArticleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="goUpdataArticle">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="文章详细"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose"
      >
        <el-card class="box-card">
          <div>
            <img
              :src="articleDetail.cover_img"
              style="
                height: 120px;
                width: 120px;
                float: left;
                margin-right: 20px;
              "
              alt=""
            />
            文章标题：<span>{{ articleDetail.title }}</span>
            <el-divider></el-divider>
            文章分类：<span>{{ articleDetail.cate_name }}</span>
            <el-divider></el-divider>
            文章内容：<span>{{ articleDetail.content }}</span>
            <el-divider></el-divider>
          </div>
          <div>
            发布时间：<span>{{ articleDetail.pub_date }}</span>
            <el-divider></el-divider>
            用户昵称：<span>{{ $store.state.userInfo.nickname }}</span>
            <el-divider></el-divider>
          </div>
          <div>
            用户名：<span>{{ $store.state.userInfo.username }}</span>
            <el-divider></el-divider>
          </div>
        </el-card>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <el-table ref="filterTable" :data="tableData" style="width: 100%">
        <el-table-column prop="cover_img" label="文章封面" width="150">
          <template slot-scope="scope">
            <img
              :src="scope.row.cover_img"
              alt=""
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="文章标题" width="130">
          <template v-slot="{ row }">
            <el-link type="primary" @click="showDetailFn(row.id)">{{
              row.title
            }}</el-link>
          </template>
        </el-table-column>

        <el-table-column prop="cate_name" label="分类" width="110">
        </el-table-column>
        <el-table-column prop="pub_date" label="发布时间" width="150">
        </el-table-column>
        <el-table-column prop="state" label="状态" width="130">
        </el-table-column>
        <el-table-column prop="likes" label="点赞数" width="100">
        </el-table-column>
        <el-table-column label="操作" width="175">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="info"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
import defaultImg from "@/assets/images/pic.png";
import {
  addArticleAPI,
  delArticleAPI,
  getArtCateListAPI,
  getArticleAPI,
  getArticleListAPI,
  getArticleListAPIPost,
  updArticleAPI,
} from "../../api/index.js";
import { showTime, timeToTimestamp } from "../../utils/functions";
export default {
  data() {
    return {
      articleDetail: {},
      upArticleDialogVisible: false,
      centerDialogVisible: false,
      dialogVisible: false,
      tableData: [],
      cateId: [],
      cateList: [],
      flagTime: false,
      flagLikes: false,
      addId: "",
      selectData: {
        cate_name: "",
        state: "",
      },
      Mythis: null,
      labelPosition: "right",
      // 存放用户发布文章的信息
      formArtData: {
        title: "",
        content: "",
        state: "",
        cate_name: "",
        cover_img: null,
      },
      updataArticle: {},
    };
  },
  created() {
    if (this.$store.state.isArtModify) {
      this.getListCate();
      this.getList();
    } else {
      this.tableData = this.$store.state.userInfo.artList;
      this.cateList = this.$store.state.userInfo.artCate;
    }
  },
  methods: {
    async goUpdataArticle() {
      // 提交更新时还需要重新设置时间
      this.updataArticle.pub_date = showTime();
      const res = await updArticleAPI(this.updataArticle);
      if (res.data.code === 0) {
        this.$message({
          type: "success",
          message: "更新文章成功!",
        });
        this.upArticleDialogVisible = false;
      } else {
        this.$message({
          type: "success",
          message: res.data.msg,
        });
      }
    },
    // 按点赞数排序 升序 flagLikes为false
    likesSort() {
      // this.readyList = this.tableData;
      if (this.flagLikes) {
        // 降序
        this.tableData.sort((a1, a2) => {
          return a1.likes - a2.likes;
        });
        this.flagLikes = false;
      } else {
        // 升序
        this.tableData.sort((a1, a2) => {
          return a2.likes - a1.likes;
        });
        this.flagLikes = true;
      }
      // 降序 flagLikes为true
    },
    // 按时间排序
    timeSort() {
      if (this.flagTime) {
        this.tableData.sort((a, b) => {
          return timeToTimestamp(a.pub_date) - timeToTimestamp(b.pub_date);
        });
        this.flagTime = false;
      } else {
        this.tableData.sort((a, b) => {
          return timeToTimestamp(b.pub_date) - timeToTimestamp(a.pub_date);
        });
        this.flagTime = true;
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    async showDetailFn(id) {
      this.dialogVisible = true;
      const res = await getArticleAPI(id);
      this.articleDetail = res.data.artMag;
    },
    // 获取文章分类信息
    async getListCate() {
      if (this.$store.first_login_cate) {
        this.cateList = this.$store.state.userInfo.artCate;
        this.$store.commit("updatalogin_cate", false);
      } else {
        const res = await getArtCateListAPI();
        console.log(res);
        // 获取到最新数据之后要进行更新
        this.$store.commit("updateCateList", res.data.cateList);
        this.cateList = this.$store.state.userInfo.artCate;
      }
    },
    async getList() {
      if (this.$store.first_login_art) {
        console.log(1111111);
        this.tableData = this.$store.state.userInfo.artList;
        this.$store.commit("updatalogin_art", false);
      } else {
        console.log(222222);
        // 初始化渲染页面的表格数据
        const res = await getArticleListAPI();
        console.log(res);
        this.$store.commit("updateArtList", res.data.artList);
        this.tableData = res.data.artList;
      }
    },
    // 选择图片->点击事件->让选择框出现
    chooseImg() {
      // 模拟点击行为
      this.$refs.iptRef.click();
    },
    // 在选择框中选择图片后触发的改变事件
    onFileChange(e) {
      // 获取用户选择的文件列表（伪数组）
      const files = e.target.files;
      this.formArtData.cover_img = "";
      if (files.length === 0) {
        // 没有选择图片
        this.formArtData.cover_img = "";
        this.$refs.imgRef.setAttribute("src", defaultImg);
      } else {
        const reader = new FileReader();
        if (files[0]) {
          reader.readAsDataURL(files[0]);
        }
        const p = new Promise((resolve, reject) => {
          reader.onload = function () {
            resolve(reader.result);
          };
        });

        p.then((res) => {
          this.formArtData.cover_img = res;
          this.updataArticle.cover_img = res;
        });

        const url = URL.createObjectURL(files[0]);
        this.$refs.imgRef.setAttribute("src", url);
      }
    },

    async addArticle() {
      this.$store.commit("isArtModifyFn", true);
      // 显示对话框
      this.centerDialogVisible = true;
      const res = await addArticleAPI({
        ...this.formArtData,
        pub_date: showTime(),
        likes: 25,
        visits: 63,
      });
      console.log(res);
      if (res.data.code === 0) {
        this.getList();
        this.$message({
          type: "success",
          message: "发表文章成功!",
        });
        this.$store.commit("isArtModifyFn", false);
        // 发布成功之后，再将之前写的表单内容清空
        this.formArtData = {};
      } else {
        this.$message({
          type: "error",
          message: res.data.message,
        });
      }
      this.centerDialogVisible = false;
    },
    reset() {
      this.selectData.cate_name = "";
      this.selectData.state = "";
    },
    async onSubmit() {
      const res = await getArticleListAPIPost(this.selectData);
      this.tableData = res.data.artList;
    },
    handleEdit(index, row) {
      this.upArticleDialogVisible = true;

      this.updataArticle = row;
    },
    handleDelete(index, row) {
      this.$confirm("是否删除该文章?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await delArticleAPI(row.id);
          console.log(res);
          if (res.data.code === 0) {
            this.getList();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.$store.commit("isDelete", true);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    resetDateFilter() {
      this.$refs.filterTable.clearFilter("date");
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
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
textarea {
  width: 365px;
  height: 150px;
  border: solid 1px #c0c4cc;
  outline-color: #66b1ff;
}

.box-card {
  width: 95%;
}
.cover-img {
  width: 100px;
  height: 100px;
}
</style>
