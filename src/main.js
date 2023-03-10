import Vue from "vue";
import App from "./App.vue";
import "./assets/global.less";
import "./elementUI/index";
import router from "./router";
import store from "./store";

// 导入腾讯地图，获取用户当前位置
import { VueJsonp } from "vue-jsonp";
Vue.prototype.$jsonp = VueJsonp;
Vue.use(VueJsonp);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
