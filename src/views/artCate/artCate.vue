<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章分类</span>
        <el-button
          style="float: right; padding: 5px"
          type="primary"
          @click="addCate"
          >添加分类</el-button
        >
      </div>
      <div class="text item">
        <el-dialog
          :title="flag === 1 ? '添加分类' : '编辑分类'"
          :visible.sync="centerDialogVisible"
          width="30%"
          center
        >
          <!-- //进去的内容区域 -->
          <el-form
            :label-position="labelPosition"
            label-width="70px"
            :model="formData"
          >
            <el-form-item label="分类名称">
              <el-input v-model="formData.cate_name"></el-input>
            </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="goaddData">确 定</el-button>
          </span>
        </el-dialog>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="序号" type="index" width="180" hei>
          </el-table-column>
          <el-table-column label="分类名称" width="220" prop="cate">
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                round
                @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                round
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  addArtCateAPI,
  delArtCateAPI,
  getArtCateListAPI,
  updateArtCateAPI,
} from "../../api/index";
export default {
  data() {
    return {
      formData: { cate_name: "" },
      tableData: [],
      labelPosition: "right",
      oldCateName: "", // 用于更新cate时存放 旧的cate
      centerDialogVisible: false,
      flag: 1,
      id: "",
    };
  },
  created() {
    // 若当前是修改过的，则需请求
    if (this.$store.state.isCateModify) {
      this.getData();
    } else {
      this.tableData = this.$store.state.userInfo.artCate;
    }
  },
  methods: {
    async addCate() {
      this.flag = 1;
      this.centerDialogVisible = true;
      this.formData.cate_name = "";
    },
    async goaddData() {
      this.$store.commit("isCateModifyFn", true);
      if (this.flag === 1) {
        // 新添加分类操作

        const res = await addArtCateAPI(this.formData.cate_name);
        console.log(res);
        if (res.data.code === 0) {
          this.centerDialogVisible = false;
          this.getData();
          this.$message({
            type: "success",
            message: "添加成功!",
          });
          this.$store.commit("isCateModifyFn", false);
        } else {
          this.$message({
            type: "error",
            message: res.data.msg,
          });
        }
      } else {
        // 若为编辑操作,则表示数据要进行分类
        const res = await updateArtCateAPI({
          oldCateName: this.oldCateName,
          newCateName: this.formData.cate_name,
        });
        console.log(res);
        if (res.data.code === 0) {
          this.centerDialogVisible = false;
          this.getData();
          this.$message({
            type: "success",
            message: "修改成功!",
          });
          this.$store.commit("isCateModifyFn", false);
        } else {
          this.$message({
            type: "error",
            message: res.data.message,
          });
          this.centerDialogVisible = false;
        }
      }
    },
    async getData() {
      if (this.$store.first_login_cate) {
        console.log(111);
        this.tableData = this.$store.state.userInfo.artCate;
        this.$store.commit("updatalogin_cate", false);
      } else {
        const res = await getArtCateListAPI();
        if (res.data.cateList.length > 0) {
          // 更新本地缓存数据
          this.$store.commit("updateCateList", res.data.cateList);
          this.tableData = res.data.cateList;
        } else {
          this.tableData = [];
          this.$store.commit("updateCateList", []);
        }
      }
    },
    handleEdit(index, row) {
      this.flag = 2;
      // 表示此时是编辑操作
      this.centerDialogVisible = true;
      this.id = row.id;
      // 此时oldCateName是更新之前的值
      this.oldCateName = row.cate;
      this.formData.cate_name = row.cate;
    },
    async handleDelete(index, row) {
      const res = await delArtCateAPI(row.cate);
      if (res.data.code === 0) {
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        console.log(res);
        this.getData();
      } else {
        this.$message({
          type: "error",
          message: res.data.msg,
        });
      }
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
