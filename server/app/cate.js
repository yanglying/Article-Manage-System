// 获取-文章分类
const express = require("express");
// 导入路由中间件
const cateRouter = express.Router();
const fs = require("fs");
const bodyParser = require("body-parser");
cateRouter.use(bodyParser.urlencoded({ extended: false }));
const path = require("node:path");
const { jwtCheck } = require("../jwt.js");

// 请求到达该路由时，判断token是否有效，有效才能进入下面的路由，否则提醒前端
cateRouter.use(jwtCheck);

// 获取分类列表
cateRouter.get("/list", (req, res) => {
  fs.readFile(path.resolve(__dirname, "../data.json"), "utf8", (err, data) => {
    if (err) console.log(err);
    let flag = false;
    const tablePerson = JSON.parse(data);
    tablePerson.forEach((item) => {
      if (item.uid === req.uid) {
        flag = true;
        res.json({
          code: 0,
          msg: "文章分类获取成功！",
          cateList: item.artCate,
        });
      }
    });
    if (!flag) {
      res.json({
        code: 1,
        msg: "文章分类获取失败！",
      });
    }
  });
});

//  增加-文章分类
cateRouter.post("/add", (req, res) => {
  fs.readFile(path.resolve(__dirname, "../data.json"), "utf8", (err, data) => {
    if (err) console.log(err);
    let flag = false;
    const tablePerson = JSON.parse(data);
    tablePerson.forEach((item) => {
      if (item.uid === req.uid) {
        item.artCate.unshift(req.body.cate_name);
        fs.writeFile(
          path.resolve(__dirname, "../data.json"),
          JSON.stringify(tablePerson),
          "utf8",
          function (err) {
            console.log(err);
          }
        );
        flag = true;
        res.json({
          code: 0,
          msg: "文章分类增加成功！",
        });
      }
    });
    if (!flag) {
      res.json({
        code: 1,
        msg: "文章分类增加失败！",
      });
    }
  });
});

//  删除-文章分类 根据分类名称来删除的
cateRouter.post("/del", (req, res) => {
  fs.readFile(path.resolve(__dirname, "../data.json"), "utf8", (err, data) => {
    if (err) console.log(err);
    const tablePerson = JSON.parse(data);
    let flag = false;
    tablePerson.forEach((item) => {
      if (item.uid === req.uid) {
        item.artCate.forEach((item, i, arr) => {
          const index = arr.indexOf(req.body.cate_name);

          if (index > -1) {
            arr.splice(index, 1);
            flag = true;
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
              msg: "文章分类删除成功！",
            });
          }
        });
      }
    });
    if (!flag) {
      res.json({
        code: 1,
        msg: "文章分类删除失败！",
      });
    }
  });
});

// 更新-文章分类
cateRouter.post("/updataInfo", (req, res) => {
  fs.readFile(path.resolve(__dirname, "../data.json"), "utf8", (err, data) => {
    if (err) console.log(err);
    let flag = false;
    const tablePerson = JSON.parse(data);
    tablePerson.forEach((item) => {
      if (item.uid === req.uid) {
        item.artCate.forEach((cate, i, arr) => {
          const index = arr.indexOf(req.body.oldCateName);
          if (index !== -1 && !flag) {
            arr[index] = req.body.newCateName;
            fs.writeFile(
              path.resolve(__dirname, "../data.json"),
              JSON.stringify(tablePerson),
              "utf8",
              function (err) {
                console.log(err);
              }
            );
            flag = true;
            res.json({
              code: 0,
              msg: "文章分类更新成功！",
            });
          }
        });
      }
    });
    if (!flag) {
      res.json({
        code: 1,
        msg: "文章分类增加失败！",
      });
    }
  });
});

// 导出子路由
module.exports = cateRouter;
