import axios from "axios";
import { Message } from "element-ui";
import router from "../router/index";
import store from "../store/index";
// 创建一个自定的axios方法
// axios函数请求的url地址前面会被拼接基地址, 然后axios请求baseURL+url后台完整地址
const myAxios = axios.create({
  baseURL: "http://139.224.104.21:8889/",
});

// 定义请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    // 为所有请求统一携带请求头 为请求头挂载 Authorization 字段即保存的是用户唯一标识uid
    config.headers.token = store.state.token;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 前端设置响应拦截器 拦截服务器传给浏览器的响应数据
myAxios.interceptors.response.use(
  function (response) {
    // 触发失败的回调，形参中的 error 是“失败的结果”
    // 若错误是token过期 则进行下面处理
    if (response.data.status === 401) {
      // 无效的 token
      // 把 Vuex 中的 用户信息 重置为空，并跳转到登录页面
      Message({
        type: "error",
        message: response.data.msg,
      });
      store.commit("initData", {});
      store.commit("updataToken", "");
      console.log(1111111111);
      router.push("/login");
    }
    return response;
  },
  (err) => {
    // 在响应错误的时候的逻辑处理
    return Promise.reject(err);
  }
);

// 导出自定义的axios方法, 供外面调用传参发请求
export default myAxios;
