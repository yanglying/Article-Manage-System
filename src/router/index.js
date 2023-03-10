import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("../views/layout/myLayout.vue"),
    redirect: "/home",
    children: [
      {
        path: "/home",
        component: () => import("../views/home/myHome.vue"),
      },
      {
        path: "/user-info",
        component: () => import("../views/user/userInfo.vue"),
      },
      {
        path: "/user-avatar",
        component: () => import("../views/userAvatar/userAvatar.vue"),
      },
      {
        path: "/user-pwd",
        component: () => import("../views/reset/reSet.vue"),
      },
      {
        path: "/art-cate",
        component: () => import("../views/artCate/artCate.vue"),
      },
      {
        path: "/art-list",
        component: () => import("../views/artList/artList.vue"),
      },
      {
        path: "/art-cycle",
        component: () => import("../views/cycle/myIndex.vue"),
      },
    ],
  },
  {
    path: "/reg",
    component: () => import("../views/register/myIndex.vue"),
  },
  {
    path: "/login",
    component: () => import("../views/login/myIndex.vue"),
  },
];
const CanList = ["/login", "/reg"];
const router = new VueRouter({
  routes,
});

// 前置路由守卫，只有当前有用户登录才能进去看页面
router.beforeEach((to, from, next) => {
  // 若当前有token 则表示当前有用户登录
  if (store.state.token) {
    next();
  } else {
    if (CanList.includes(to.path)) {
      next();
    } else {
      next("/login");
    }
  }
});
export default router;
