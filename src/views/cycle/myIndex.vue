<template>
  <el-card class="box-card">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="cover_img" label="文章封面" width="130">
          <template slot-scope="scope">
            <img
              :src="scope.row.cover_img"
              alt=""
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>

      <el-table-column prop="title" label="文章标题" width="130"> </el-table-column>
      <el-table-column prop="cate_name" label="分类"  width="110"> </el-table-column>
      <el-table-column prop="pub_date" label="发布时间" width="150"> </el-table-column>
      <el-table-column prop="state" label="状态"  width="130"> </el-table-column>
      <el-table-column prop="likes" label="点赞数"  width="130"> </el-table-column>
      <el-table-column label="操作" width="175">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleRestore(scope.$index, scope.row)"
              >恢复</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >彻底删除</el-button
            >
          </template>
        </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { delArticleCycleAPI, getCycleArt, reStoreArticleAPI } from '../../api/index.js';
export default {
  data() {
    return {
      tableData: [],
    };
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      const res = await getCycleArt()
      console.log(res);
      this.tableData = res.data.artCycleList
    },
    async handleRestore(index, row) {
      const res = await reStoreArticleAPI(row.id)
      console.log(res);
      if (res.data.code === 0) {
        this.$message({
          type: "success",
          message: "恢复成功!",
        });
      }
      this.$store.commit('updateArtList', res.data.artList)
      this.getData()
    },
    async handleDelete(index, row) {
      this.$confirm("是否彻底删除该文章?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await delArticleCycleAPI(row.id)
          console.log(res);
          if (res.data.code === 0) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getData()
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>

.box-card {
  width: 480px;

.item {
  padding: 18px 0;
}

}
