// 需要调用的网络请求的Api接口,这些接口的返回值都是哥promise对象
import myAxios from "../utils/request";
export const registerAPI = ({ username, password, repassword }) => {
  // return 的是个promise对象，要在具体逻辑页面去获取数据
  return myAxios({
    url: "/user/reg",
    method: "post",
    data: {
      username,
      password,
      repassword,
    },
  });
};

// 登录接口
export const loginAPI = ({ username, password }) => {
  return myAxios({
    url: "/user/login",
    method: "post",
    data: {
      username,
      password,
    },
  });
};

// 更新用户基本资料
export const upDataAPI = (nickname, email) => {
  return myAxios({
    method: "post",
    url: "/user/updata/userinfo",
    data: {
      nickname,
      email,
    },
  });
};

/**
 * 更新-用户头像
 * @param {*} avatar 头像的base64字符串
 * @returns Promise对象
 */
export const updateAvatarAPI = (avatar) => {
  return myAxios({
    url: "/user/update/avatar",
    method: "PATCH",
    data: {
      avatar,
    },
  });
};

/**
 * 更新-用户密码
 * @param {*} param0 { old_pwd: 旧密码, new_pwd: 新密码, re_pwd: 新密码确认 }
 * @returns Promise对象
 */
export const updatePwdAPI = ({ new_pwd, old_pwd, re_pwd }) => {
  return myAxios({
    url: "/user/updatepwd",
    method: "post",
    data: {
      new_pwd,
      old_pwd,
      re_pwd,
    },
  });
};

/**
 * 获取-文章分类
 * @returns Promise对象
 */
export const getArtCateListAPI = () => {
  return myAxios({
    url: "/cate/list",
  });
};

/**
 * 增加-文章分类
 * @param {*} param0 { cate_name: 文章分类名字, cate_alias: 文章分类别名 }
 * @returns Promise对象
 */
export const addArtCateAPI = (cate_name) => {
  return myAxios({
    url: "/cate/add",
    method: "POST",
    data: {
      cate_name: cate_name,
    },
  });
};

/**
 *
 * 删除-文章分类 根据分类名称来删除的
 * @returns Promise对象
 */
export const delArtCateAPI = (cate_name) => {
  return myAxios({
    url: "/cate/del",
    method: "post",
    data: {
      cate_name,
    },
  });
};

/**
 * 更新-文章分类  根据旧名称来更新新的名称分类
 * @param {*} param0 { id: 文章分类id, cate_name: 文章分类名字, cate_alias: 文章分类别名 }
 * @returns Promise对象
 */
export const updateArtCateAPI = ({ oldCateName, newCateName }) => {
  return myAxios({
    url: "/cate/updataInfo",
    method: "post",
    data: {
      oldCateName,
      newCateName,
    },
  });
};

// 发布新的文章  包括文章内容标题 分类等等，还有文章的id在后台加上去的
export const addArticleAPI = (formdata) => {
  return myAxios({
    url: "/article/add",
    method: "POST",
    data: {
      formdata,
    }, // 参数要的是表单对象, 不能写普通对象, axios内部会判断, 如果是表单对象, 传递的请求体会设置Content-Type: form-data与后端对应
  });
};

// 更新文章
export const updArticleAPI = (formdata) => {
  return myAxios({
    url: "/article/updata",
    method: "POST",
    data: {
      formdata,
    },
  });
};

/**
 * 删除-文章
 * @param {*} id 文章id
 * @returns Promise对象
 */
export const delArticleAPI = (id) => {
  return myAxios({
    url: "/article/del",
    method: "post",
    data: {
      id,
    },
  });
};

/**
 * 获取符合条件的所有的文章列表
 * @param {*} param0 {  cate_id: 文章分类id, state: 文章状态 }
 * @returns Promise对象
 */
export const getArticleListAPIPost = ({ cate_name, state }) => {
  return myAxios({
    url: "/article/listPost",
    method: "post",
    data: {
      cate_name,
      state,
    },
  });
};

// 无条件获取当前用户的所有文章列表
export const getArticleListAPI = () => {
  return myAxios({
    url: "/article/listAll",
    method: "get",
  });
};

// 获取某个具体一篇文章
export const getArticleAPI = (id) => {
  return myAxios({
    url: "/article/info?id=" + id,
    method: "GET",
  });
};

// 获取回收站中的文章
export const getCycleArt = () => {
  return myAxios({
    url: "/article/cycle",
    method: "GET",
  });
};

// 彻底删除文章，删除回收站中的文章
export const delArticleCycleAPI = (id) => {
  return myAxios({
    url: "/article/cycleArticle/delete",
    data: {
      id,
    },
    method: "delete",
  });
};
// 恢复删除的文章
export const reStoreArticleAPI = (id) => {
  return myAxios({
    url: "/article/cycleArticle/add",
    data: {
      id,
    },
    method: "post",
  });
};
