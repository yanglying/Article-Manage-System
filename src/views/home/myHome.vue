<template>
  <el-card class="box-card">
    <div v-if="!totalArtNum">
      <el-empty
        description="您还未发布任何文章！请至文章列表进行发布！"
      ></el-empty>
    </div>
    <div v-else class="content">
      <div class="top">
        <!-- //上部 -->
        <el-row class="spannel_list" :gutter="10">
          <el-col :sm="6" :xs="12">
            <div class="spannel">
              <em>{{ totalArtNum }}</em
              ><span>篇</span>
              <b>总文章数</b>
            </div>
          </el-col>
          <el-col :sm="6" :xs="12">
            <div class="spannel scolor01">
              <em>{{ totalArtVisit }}</em
              ><span>次</span>
              <b>总访问数</b>
            </div>
          </el-col>
          <el-col :sm="6" :xs="12">
            <div class="spannel scolor02">
              <em>{{ totalArtLikes }}</em
              ><span>个</span>
              <b>总点赞数</b>
            </div>
          </el-col>
          <el-col :sm="6" :xs="12">
            <div class="spannel scolor03">
              <em>123</em><span>个</span>
              <b>日新增点赞数</b>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="mid">
        <div class="gragh_pannel" id="pie_show"></div>
        <div class="gragh_pannel" id="line_show"></div>
      </div>
      <div class="bottom">
        <div class="column_pannel" id="column_show"></div>
      </div>
    </div>
  </el-card>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
import { getArtCateListAPI, getArticleListAPI } from "../../api/index";
export default {
  name: "my-home",
  data() {
    return {
      totalArtNum: 0,
      totalArtLikes: 0,
      totalArtVisit: 0,
      cateList: [],
      artList: [],
      pieData: [],
    };
  },
  mounted() {
    this.picChartFn();
    this.columnChartFn();
  },

  // //     this.pieData = this.cateList;
  //     this.pieData.forEach((item, i, arr) => {
  //       arr[i] = { value: 0, name: item };
  //     });
  methods: {
    async getArtCateList() {
      const res = await getArtCateListAPI();
      this.cateList = res.data.cateList;
      return new Promise((resolve, reject) => {
        resolve(this.cateList);
      });
    },
    async getArtList() {
      const res = await getArticleListAPI();
      this.artList = res.data.artList;
      this.totalArtNum = this.artList.length;
      return new Promise((resolve, reject) => {
        resolve(this.artList);
      });
    },

    getPieData(cb) {
      this.getArtCateList().then((cate) => {
        this.pieData = cate;
        this.pieData.forEach((item, i, arr) => {
          arr[i] = { value: 0, name: item };
        });
        this.getArtList().then((resArt) => {
          resArt.forEach((item) => {
            this.totalArtLikes += item.likes;
            this.totalArtVisit += item.visits;
            this.pieData.forEach((cateObj) => {
              if (item.cate_name === cateObj.name) {
                cateObj.value++;
              }
            });
          });
          cb(this.pieData);
        });
      });
    },

    // 设置饼状图
    picChartFn() {
      this.getPieData((res) => {
        const oPie = echarts.init(document.getElementById("pie_show"));
        const oPieopt = {
          title: {
            top: 4,
            text: "分类文章数量比",
            x: "center",
          },
          tooltip: {
            trigger: "item", // 在图形上才会触发提示
            formatter: "{a} <br/>{b} : {c}篇 ({d}%)", // 提示的文字显示的格式
          },
          color: ["#5845e8", "#12cfd5", "#00ce68", "#ef9565"], // 系列颜色
          legend: {
            // 图例组件
            x: "center",
            top: 35,
            data: this.cateList, // 也就是文章分类数组
          },
          toolbox: {
            // 工具箱
            show: true,
            x: "center",
            left: 10,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              magicType: {
                show: true,
              },
              restore: { show: true },
              saveAsImage: { show: true },
            },
          },
          series: [
            {
              name: "文章分类比例",
              type: "pie",
              radius: ["45%", "65%"],
              center: ["50%", "65%"],
              data: res,
            },
          ],
        };
        oPie.setOption(oPieopt);
      });
    },
    // 设置底部柱状图
    async columnChartFn() {
      this.getArtList().then((res) => {
        const arrValue = [];
        const arrName = [];
        res.forEach((item) => {
          arrValue.push(item.visits);
          arrName.push(item.cate_name);
        });
        const oColumn = echarts.init(document.getElementById("column_show"));
        const option = {
          title: {
            top: 15,
            text: "各分类文章访问数量",
            x: "center",
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          color: "#12cfa5",
          grid: {
            left: "10%",
            right: "10%",
            bottom: "12%",
          },
          xAxis: [
            {
              name: "category",
              data: arrName,
              axisTick: {
                alignWithLabel: true,
              },
              axisLine: {
                show: true,
                type: "solid",
                symbol: ["none", "arrow"],
              },
            },
          ],
          yAxis: [
            {
              type: "value",
              axisLine: {
                show: true,
                symbol: ["none", "arrow"],
              },
            },
          ],
          series: [
            {
              name: "访问数量：",
              type: "bar",
              barWidth: "30%",
              data: arrValue,
              axisLine: {
                show: true,
                type: "solid",
                symbol: ["none", "arrow"],
              },
            },
          ],
        };
        oColumn.setOption(option);
        this.setLine();
      });
    },
    setLine() {
      setTimeout(() => {
        const mychart = echarts.init(document.getElementById("line_show"));
        const option = {
          title: {
            top: 12,
            text: "各分类文章点赞数",
            x: "center",
          },
          xAxis: {
            type: "category",
            data: ["A", "B", "C"],
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: [120, 200, 150],
              smooth: true,

              position: "center",
              type: "line",
              lineStyle: {
                normal: {
                  color: "blue",
                  width: 2,
                },
              },
              label: {
                show: true,
                position: "bottom",
                textStyle: {
                  fontSize: 12,
                },
              },
            },
          ],
        };
        mychart.setOption(option);
      }, 1);
    },
  },
};
</script>
<style lang="less" scoped>
.box-card {
  height: 100%;
  .content {
    height: 100%;
    width: 100%;
    overflow: scroll;
    .top {
      .spannel_list {
        margin-top: 15px;
      }
      .spannel {
        height: 100px;
        overflow: hidden;
        text-align: center;
        position: relative;
        background-color: #fff;
        border: 1px solid #e7e7e9;
        margin-bottom: 10px;
      }

      .spannel em {
        font-style: normal;
        font-size: 50px;
        line-height: 50px;
        display: inline-block;
        margin: 10px 0 0 20px;
        background-color: #fff;
        font-family: "Arial";
        color: #7594de;
      }
      .spannel span {
        font-size: 14px;
        display: inline-block;
        color: #273f76;
        margin-left: 10px;
        background-color: #fff;
      }

      .spannel b {
        position: absolute;
        left: 0;
        bottom: 0;

        width: 100%;
        line-height: 24px;
        background: #e5e5e5;
        color: #333;
        font-size: 14px;
        font-weight: normal;
      }

      .scolor01 em,
      .scolor01 span {
        color: #6ac6e2;
      }

      .scolor02 em,
      .scolor02 span {
        color: #5fd9de;
      }

      .scolor03 em,
      .scolor03 span {
        color: #07901b;
      }
    }
    .mid {
      display: flex;
      justify-content: center;
      .gragh_pannel {
        height: 195px;
        width: 100%;
        margin-top: 20px;
      }
    }
    .bottom {
      .column_pannel {
        height: 200px;
        width: 100%;
        margin-top: 20px;
      }
    }
  }
}
</style>
