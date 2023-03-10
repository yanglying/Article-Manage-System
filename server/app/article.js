// 发布新的文章
const express = require("express");
// 导入路由中间件
const articleRouter = express.Router();
const fs = require("fs");

const bodyParser = require("body-parser");
articleRouter.use(bodyParser.urlencoded({ extended: false }));
const path = require("node:path");
const { uidFn } = require("../utils.js");
const { jwtCheck } = require("../jwt.js");

// 请求到达该路由时，判断token是否有效
articleRouter.use(jwtCheck);

articleRouter.post("/add", (req, res) => {
  fs.readFile(path.resolve(__dirname, "../data.json"), "utf8", (err, data) => {
    if (err) console.log(err);
    let flag = false;
    const tablePerson = JSON.parse(data);
    tablePerson.forEach((item) => {
      if (item.uid === req.uid) {
        item.artList.unshift({
          ...req.body.formdata,
          id: uidFn(),
        });
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
          artList: item.artList,
          msg: "发布文章成功！",
        });
      }
    });
    if (!flag) {
      res.json({
        code: 1,
        msg: "发布文章失败",
      });
    }
  });
});

// 更新具体的某篇文章
articleRouter.post("/updata", (req, res) => {
  fs.readFile(path.resolve(__dirname, "../data.json"), "utf8", (err, data) => {
    if (err) console.log(err);
    let flag = false;
    const tablePerson = JSON.parse(data);
    tablePerson.forEach((item) => {
      if (item.uid === req.uid) {
        item.artList.forEach((item, i, arrArticles) => {
          if (item.id === req.body.formdata.id) {
            arrArticles[i] = req.body.formdata;
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
              msg: "文章更新成功！",
            });
          }
        });
      }
    });
    if (!flag) {
      res.json({
        code: 1,
        msg: "文章更新失败",
      });
    }
  });
});

// 删除-文章
articleRouter.post("/del", (req, res) => {
  fs.readFile(path.resolve(__dirname, "../data.json"), "utf8", (err, data) => {
    if (err) console.log(err);
    let flag = false;
    const tablePerson = JSON.parse(data);
    tablePerson.forEach((item) => {
      if (item.uid === req.uid) {
        item.artList.forEach((art, i, arr) => {
          if (art.id === req.body.id) {
            // 将用户删除的文章放入回收站
            item.artCycleList.unshift(art);
            const index = arr.indexOf(art);
            arr.splice(index, 1);
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
              artList: item.artList,
              msg: "删除文章成功！",
            });
          }
        });
      }
    });
    if (!flag) {
      res.json({
        code: 1,
        msg: "删除文章失败",
      });
    }
  });
});

// 根据筛选的关键词 获取文章列表
articleRouter.post("/listPost", (req, res) => {
  fs.readFile(path.resolve(__dirname, "../data.json"), "utf8", (err, data) => {
    if (err) console.log(err);
    let flag = false;
    const tablePerson = JSON.parse(data);
    const returnArr = [];
    tablePerson.forEach((item) => {
      if (item.uid === req.uid && !flag) {
        flag = true;
        item.artList.forEach((article) => {
          if (
            article.cate_name === req.body.cate_name &&
            article.state === req.body.state
          ) {
            returnArr.push(article);
          }
        });

        res.json({
          code: 0,
          // 获取符合条件的文章列表
          artList: returnArr,
          msg: "获取文章列表成功！这是post   请求的",
        });
      }
    });
    if (!flag) {
      res.json({
        code: 1,
        msg: "获取文章列表失败",
      });
    }
  });
});

// 获取具体的某一篇文章
articleRouter.get("/info", (req, res) => {
  fs.readFile(path.resolve(__dirname, "../data.json"), "utf8", (err, data) => {
    if (err) console.log(err);
    let flag = false;
    const tablePerson = JSON.parse(data);
    tablePerson.forEach((item) => {
      if (item.uid === req.uid && !flag) {
        item.artList.forEach((art) => {
          if (art.id === req.query.id) {
            flag = true;
            res.json({
              code: 0,
              artMag: art,
              msg: "获取该文章成功！",
            });
          }
        });
      }
    });
    if (!flag) {
      res.json({
        code: 1,
        msg: "获取该文章失败！",
      });
    }
  });
});

// 获取该用户的全部的文章列表
articleRouter.get("/listAll", (req, res) => {
  fs.readFile(path.resolve(__dirname, "../data.json"), "utf8", (err, data) => {
    if (err) console.log(err);
    let flag = false;
    const tablePerson = JSON.parse(data);
    tablePerson.forEach((item) => {
      if (item.uid === req.uid && !flag) {
        flag = true;
        res.json({
          code: 0,
          artList: item.artList,
          msg: "获取文章列表成功！",
        });
      }
    });
    if (!flag) {
      res.json({
        code: 1,
        msg: "获取文章列表失败",
      });
    }
  });
});

//  获取回收站中的文章列表
articleRouter.get("/cycle", (req, res) => {
  fs.readFile(path.resolve(__dirname, "../data.json"), "utf8", (err, data) => {
    if (err) console.log(err);
    const flag = false;
    const tablePerson = JSON.parse(data);
    tablePerson.forEach((item) => {
      if (item.uid === req.uid && !flag) {
        res.json({
          code: 0,
          // 获取符合条件的文章列表
          artCycleList: item.artCycleList,
          msg: "获取回车站文章列表成功!",
        });
      }
    });
  });
});

// 恢复回车站中的某一篇文章，将该文章再加入到用户的artList中，
// 并删除回车文章列表中的该项
articleRouter.post("/cycleArticle/add", (req, res) => {
  fs.readFile(path.resolve(__dirname, "../data.json"), "utf8", (err, data) => {
    if (err) console.log(err);
    let flag = false;
    const tablePerson = JSON.parse(data);
    tablePerson.forEach((item) => {
      if (item.uid === req.uid && !flag) {
        item.artCycleList.forEach((art, i, arr) => {
          if (art.id === req.body.id) {
            item.artList.unshift(art);
            const index = arr.indexOf(art);
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
              artList: item.artList,
              artCycleList: item.artCycleList,
              msg: "恢复文章成功！",
            });
          }
        });
      }
    });
    if (!flag) {
      res.json({
        code: 1,
        msg: "恢复文章失败！",
      });
    }
  });
});

// 彻底删除回车站中的某一篇文章，即只需在回车文章列表直接删除即可
articleRouter.delete("/cycleArticle/delete", (req, res) => {
  fs.readFile(path.resolve(__dirname, "../data.json"), "utf8", (err, data) => {
    if (err) console.log(err);
    let flag = false;
    const tablePerson = JSON.parse(data);
    tablePerson.forEach((item) => {
      if (item.uid === req.uid && !flag) {
        item.artCycleList.forEach((art, i, arr) => {
          if (art.id === req.body.id) {
            const index = arr.indexOf(art);
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
              msg: "彻底删除文章成功！",
            });
          }
        });
      }
    });
    if (!flag) {
      res.json({
        code: 1,
        msg: "彻底删除文章失败！",
      });
    }
  });
});
// 导出子路由
module.exports = articleRouter;
