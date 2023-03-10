<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <div class="outer">
      <el-header class="header">
        <div class="left" style="text-align: center">
          <h1 style="color: white; font-size: 22px">文章后台管理系统</h1>
        </div>
        <div class="right">
          <el-menu
            class="el-menu-top"
            mode="horizontal"
            background-color="#204977"
            text-color="#fff"
            active-text-color="#409EFF"
          >
            <el-submenu index="1" class="one">
              <template slot="title">
                <!-- 头像 -->
                <img
                  v-if="!$store.state.userInfo.avatar"
                  src="../../assets/images/pic.png"
                  alt=""
                  class="avatar"
                />
                <img
                  v-else
                  :src="$store.state.userInfo.avatar"
                  alt=""
                  class="avatar"
                />
                <!-- <span>个人中心</span> -->
              </template>
              <span style="color: #fff; font-size: 15px">个人中心</span>
              <el-menu-item
                index="1-1"
                @click.native="$router.push('/user-info')"
                ><i class="el-icon-s-operation"></i>基本资料</el-menu-item
              >
              <el-menu-item
                index="1-2"
                @click.native="$router.push('/user-avatar')"
                ><i class="el-icon-camera"></i>更换头像</el-menu-item
              >
              <el-menu-item
                index="1-3"
                @click.native="$router.push('/user-pwd')"
                ><i class="el-icon-key"></i>重置密码</el-menu-item
              >
            </el-submenu>
            <el-menu-item index="2" @click.native="unlogin" class="two"
              ><i class="el-icon-switch-button"></i>退出登录</el-menu-item
            >
          </el-menu>
        </div>
      </el-header>
      <el-container class="content">
        <el-aside width="210px" class="aside">
          <div class="user-box" @click="goUserInfo">
            <img
              v-if="$store.state.userInfo.avatar"
              :src="$store.state.userInfo.avatar"
              alt=""
            />
            <img v-else src="../../assets/images/pic.png" alt="" />
            <span style="color: white; font-size: 14px"
              >用户：
              {{
                $store.state.userInfo.nickname || $store.state.userInfo.username
              }}</span
            >
          </div>

          <div class="likes">
            <span class="spanitem"><span>关注</span><span>100</span></span>
            <span class="spanitem"><span>粉丝</span><span>10</span></span>
            <span class="spanitem"><span>总获赞数</span><span>130</span></span>
          </div>

          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            text-color="#fff"
            background-color="#1F426E"
            active-text-color="#409EFF"
            router
          >
            <template v-for="item in NavList">
              <!-- 不包含子菜单的“一级菜单” -->
              <el-menu-item
                :index="item.indexPath"
                :key="item.indexPath"
                v-if="!item.children"
              >
                <i :class="item.icon"></i> {{ item.title }}
              </el-menu-item>

              <!-- 包含子菜单的“一级菜单” -->
              <el-submenu :index="item.indexPath" :key="item.indexPath" v-else>
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span>{{ item.title }}</span>
                </template>
                <!-- 循环渲染“二级菜单” -->
                <el-menu-item
                  :index="childItem.indexPath"
                  v-for="childItem in item.children"
                  :key="childItem.indexPath"
                >
                  <i :class="childItem.icon"></i>{{ childItem.title }}
                </el-menu-item>
              </el-submenu>
            </template>
          </el-menu>

          <div class="slide_bottom">
            <span class="one"
              >上一次登录时间：{{ $store.state.userInfo.last_login }}</span
            >
            <span class="two">上一次登录地点：{{ localCity }}</span>
          </div>
        </el-aside>

        <el-container class="main">
          <!-- 页面主体区域 -->
          <el-main>
            <router-view></router-view>
          </el-main>
          <!-- 底部 footer 区域 -->
          <el-footer><span></span></el-footer>
        </el-container>
      </el-container>
    </div>
  </el-container>
</template>

<script>
export default {
  name: "my-layout",
  data() {
    return {
      NavList: [
        {
          indexPath: "/home",
          title: "首页",
          icon: "el-icon-s-home",
          children: null,
        },
        {
          indexPath: "2",
          title: "文章管理",
          icon: "el-icon-s-order",
          children: [
            {
              indexPath: "/art-cate",
              title: "文章分类",
              icon: "el-icon-s-data",
            },
            {
              indexPath: "/art-list",
              title: "文章列表",
              icon: "el-icon-document-copy",
            },
            {
              indexPath: "/art-cycle",
              title: "回收站",
              icon: "el-icon-delete",
            },
          ],
        },
        {
          indexPath: "3",
          title: "个人中心",
          icon: "el-icon-user-solid",
          children: [
            {
              indexPath: "/user-info",
              title: "基本资料",
              icon: "el-icon-s-operation",
            },
            {
              indexPath: "/user-avatar",
              title: "头像设置",
              icon: "el-icon-camera",
            },
            {
              indexPath: "/user-pwd",
              title: "重置密码",
              icon: "el-icon-key",
            },
          ],
        },
      ],
      localCity: "",
    };
  },
  created() {
    this.getCity();
  },
  methods: {
    getCity() {
      const data = {
        key: "KSPBZ-V5L33-5EM3D-35N5X-DIY66-CRF7J", // 申请的密钥,写死就行
      };
      const url = "https://apis.map.qq.com/ws/location/v1/ip"; // 这个就是地理位置信息的接口
      data.output = "jsonp";
      this.$jsonp(url, data)
        .then((res) => {
          this.localCity = res.result.ad_info.city;
          return res;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    goUserInfo() {
      this.$router.push("/user-info");
    },
    unlogin() {
      // localStorage.removeItem('')
      this.$confirm("您是否确定要退出登录", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!",
          });
          // 退出登录后则将store中的用户数据清空和token也清空并再次跳转到登录页面
          this.$store.commit("initData", {});
          this.$store.commit("updataToken", "");
          this.$router.push("/login");
        })
        .catch(() => {
          console.log("取消成功");
        });
    },
  },
};
</script>

<style lang="less">
.main-container {
  .outer {
    background: url("../../assets/images/img-2.jpg") center;

    width: 100%;
    height: 950px;
    .header {
      height: 100px;
      display: flex;
      .left {
        height: 100%;
        flex: 1;
      }
      .right {
        height: 100%;
        width: 0.1px;

        background-color: pink;
        .avatar {
          border-radius: 50%;
          width: 35px;
          height: 35px;

          margin-right: 10px;
          object-fit: cover;
          color: #000;
        }
        background-color: rgb(39, 1, 1);
        .el-menu-top {
          display: flex;
          justify-content: end;
          height: 100%;
          .one {
            height: 100%;
            width: 120px;
            span {
              font-size: 20px;
            }
          }
          .two {
            width: 120px;
            height: 100%;
          }
        }
      }
    }
    .content {
      .aside {
        margin-top: 40px;
        margin-left: 60px;
        .user-box {
          height: 70px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: rgb(255, 255, 255);
        }

        .user-box:hover {
          cursor: pointer;
        }
        .likes {
          padding-top: 8px;
          padding-bottom: 8px;
          display: flex;
          font-size: 13px;
          color: white;
          .spanitem {
            padding-left: 22px;
            display: flex;
            flex-direction: column;
            span {
              margin: 2px 0;
            }
          }
        }
        .slide_bottom {
          display: flex;
          flex-direction: column;
          font-size: 10px;
          color: white;

          .one {
            top: 750px;
            position: absolute;
            margin-bottom: 10px;
          }
          .two {
            top: 775px;
            position: absolute;
            margin-bottom: 10px;
          }
        }
        img {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background-color: #fff;
          margin-right: 15px;
          object-fit: cover;
        }
      }
      .main {
        height: 700px;
        width: 600px;

        margin-top: 40px;
      }
    }
  }
}
</style>
