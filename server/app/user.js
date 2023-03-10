const express = require("express");
// 导入路由中间件
const userRouter = express.Router();
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("node:path");

const { showTime, uidFn } = require("../utils.js");
const { jwtSign, jwtCheck } = require("../jwt.js");
userRouter.use(bodyParser.urlencoded({ extended: false }));

// 请求到达该路由时之前，判断token是否有效，有效才放行，否则返回错误信息给前台
userRouter.use(jwtCheck);

userRouter.post("/reg", (req, res) => {
  let flag = false;
  // 判断是否有同名的用户
  fs.readFile(path.resolve(__dirname, "../data.json"), "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }
    // 存放读取到的数据
    const tablePerson = JSON.parse(data);
    tablePerson.forEach((item) => {
      if (item.username === req.body.username) {
        flag = true;
        res.json({
          code: 1,
          msg: "该用户名已经注册！请修改用户名",
        });
      }
    });
    if (req.body.password !== req.body.repassword && !flag) {
      res.json({
        code: 1,
        msg: "密码与确认密码不一致，请重新输入",
      });
    }
    if (req.body.password === req.body.repassword && !flag) {
      // 注册成功，将用户信息进行存储
      tablePerson.push({
        uid: uidFn(), // 用户的唯一标识
        username: req.body.username, // 用户名
        password: req.body.password, // 密码
        repassword: req.body.repassword,
        artCate: [], // 文章分类列表
        artList: [], // 用户发布的文章列表
        avatar: "",
        artCycleList: [],
        email: "",
        nickname: "",
      });
      // 数据再次写入到文件中
      fs.writeFile(
        path.resolve(__dirname, "../data.json"),
        JSON.stringify(tablePerson),
        "utf8",
        function (err) {
          console.log(err);
        }
      );
      res.json({
        code: 0,
        msg: "注册成功！请进行登录使用！",
      });
    }
  });
});

userRouter.post("/login", (req, res) => {
  let flag = false; // 用来标识 该用户是否注册过
  fs.readFile(path.resolve(__dirname, "../data.json"), "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }
    const tablePerson = JSON.parse(data);
    tablePerson.forEach((item) => {
      if (item.username === req.body.username) {
        flag = true;
        if (item.password === req.body.password) {
          // 根据用户的唯一标识进行签名
          const token = jwtSign(item.uid);
          item.last_login = showTime();
          fs.writeFile(
            path.resolve(__dirname, "../data.json"),
            JSON.stringify(tablePerson),
            "utf8",
            function (err) {
              console.log(err);
            }
          );

          // 为登录成功后的用户发送加密签名后的token
          res.json({
            code: 0,
            personMsg: {
              username: item.username,
              artList: item.artList,
              artCate: item.artCate,
              artCycleList: item.artCycleList,
              last_login: item.last_login,
              avatar: item.avatar,
              email: item.email ? item.email : "",
              nickname: item.nickname ? item.nickname : "",
            },
            token: token,
            msg: "登录成功 !",
          });
        } else {
          res.json({
            code: 1,
            msg: "密码错误！",
          });
        }
      }
    });
    if (!flag) {
      res.json({
        code: 2,
        msg: "该用户名未进行注册",
      });
    }
  });
});

// 更新用户基本资料
userRouter.post("/updata/userinfo", (req, res) => {
  fs.readFile(path.resolve(__dirname, "../data.json"), "utf8", (err, data) => {
    let flag = false;
    if (err) console.log(err);
    const tablePerson = JSON.parse(data);

    tablePerson.forEach((item) => {
      if (item.uid === req.uid) {
        item.nickname = req.body.nickname;
        item.email = req.body.email;
        flag = true; // 表示更新成功的
        fs.writeFile(
          path.resolve(__dirname, "../data.json"),
          JSON.stringify(tablePerson),
          "utf8",
          function (err) {
            console.log(err);
          }
        );
        res.json({
          code: 0,
          msg: "用户信息更新成功！",
        });
      }
    });

    if (!flag) {
      res.json({
        code: 1,
        msg: "用户信息更新失败！",
      });
    }
  });
});

// 更新-用户头像
userRouter.patch("/update/avatar", (req, res) => {
  fs.readFile(path.resolve(__dirname, "../data.json"), "utf8", (err, data) => {
    let flag = false;
    if (err) console.log(err);
    const tablePerson = JSON.parse(data);
    tablePerson.forEach((item) => {
      if (item.uid === req.uid) {
        item.avatar = req.body.avatar;
        flag = true; // 表示更新成功的
        fs.writeFile(
          path.resolve(__dirname, "../data.json"),
          JSON.stringify(tablePerson),
          "utf8",
          function (err) {
            console.log(err);
          }
        );
        res.json({
          code: 0,
          msg: "头像更新成功！",
        });
      }
    });

    if (!flag) {
      res.json({
        code: 1,
        msg: "头像更新失败！",
      });
    }
  });
});

// 更新-用户密码
userRouter.post("/updatepwd", (req, res) => {
  fs.readFile(path.resolve(__dirname, "../data.json"), "utf8", (err, data) => {
    let flag = false;
    if (err) console.log(err);
    const tablePerson = JSON.parse(data);
    tablePerson.forEach((item) => {
      if (item.uid === req.uid) {
        if (req.body.new_pwd !== req.body.re_pwd) {
          res.json({
            code: 1,
            msg: "修改失败！两次输入的密码不一致！",
          });
        }
        if (item.password !== req.body.old_pwd) {
          res.json({
            code: 2,
            msg: "修改失败！原密码输入错误！",
          });
        }
        if (
          item.password === req.body.old_pwd &&
          req.body.new_pwd === req.body.re_pwd &&
          !flag
        ) {
          item.password = req.body.new_pwd;
          flag = true; // 表示更新成功的
          fs.writeFile(
            path.resolve(__dirname, "../data.json"),
            JSON.stringify(tablePerson),
            "utf8",
            function (err) {
              console.log(err);
            }
          );
          res.json({
            code: 0,
            msg: "密码更新成功！",
          });
        }
      }
    });
  });
});

// 导出子路由
module.exports = userRouter;
