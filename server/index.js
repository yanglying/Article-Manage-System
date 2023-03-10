const express = require("express");
const bodyParser = require("body-parser");
// 引入JWT中的签名与解密函数
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const userRouter = require("./app/user.js");
const cateRouter = require("./app/cate.js");
const articleRouter = require("./app/article.js");

const port = 8889;

// 设置中间件，拦截所有请求为他们加上请求头
app.use(function (req, res, next) {
  // 设置跨域访问
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, DELETE,PATCH,OPTION"
  );
  res.setHeader("X-Powered-By", " 3.2.1");
  res.setHeader("Content-Type", "application/json;charset=utf-8");

  next();
});

app.use("/user", userRouter);
app.use("/cate", cateRouter);
app.use("/article", articleRouter);

var server = app.listen(port, "0.0.0.0", () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log("地址为 http://%s:%s", host, port);
});
