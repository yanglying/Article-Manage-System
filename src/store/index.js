import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: "",
    first_login_cate: true,
    first_login_art: true,
    isCateModify: false,

    isDelete: false,
    isArtModify: false,
    userInfo: {}, // 定义用户信息对象
  },
  getters: {},
  mutations: {
    updataToken(state, data) {
      state.token = data;
    },
    updatalogin_cate(state, data) {
      state.first_login_cate = data;
    },
    // 当用户不是第一次登录的时候 标记就为false
    updatalogin_art(state, data) {
      state.first_login_art = data;
    },
    updataAvatar(state, info) {
      state.userInfo.avatar = info;
    },
    // 更新用户的信息
    updateUserInfo(state, info) {
      state.userInfo.nickname = info.nickname;
      state.userInfo.email = info.email;
    },
    // 更新用户分类列表
    updateCateList(state, artCate) {
      if (artCate) {
        artCate.forEach((item, i, arr) => {
          arr[i] = { index: i, cate: item };
        });
      }
      state.userInfo.artCate = artCate;
    },
    // 更新用户文章列表artList
    updateArtList(state, artList) {
      state.userInfo.artList = artList;
    },

    isCateModifyFn(state, info) {
      state.isCateModify = info;
    },
    isArtModifyFn(state, info) {
      state.isArtModify = info;
    },

    isDelete(state, info) {
      state.isDelete = info;
    },
    initData(state, info) {
      state.userInfo = info;
      if (state.userInfo.artCate) {
        state.userInfo.artCate.forEach((item, i, arr) => {
          arr[i] = { index: i, cate: item };
        });
      }
    },
  },
  actions: {
    // 在actions中获取用户数据，从而实现在所有组件中都能共享到该数据
    initUserInfo(store, userdata) {
      // 更新用户数据
      store.commit("initData", userdata);
    },
    updataAvatar(commit, info) {
      this.commit("updataAvatar", info);
    },
  },

  plugins: [createPersistedState()], // 使用插件 就不需要每次都手动写存储方法
});
