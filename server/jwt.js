const jwt = require("jsonwebtoken");

// token生成的密匙，根据自己需求定义
const jwtKey = "yanglanying123456";

// token生成函数(jwtSign)，即用私钥对数据进行签名，有效时间为一天，并返回签名之后的签名数据
const jwtSign = (data) => {
  const token = jwt.sign({ data }, jwtKey, { expiresIn: 24 * 60 * 60 });
  return token;
};
const arr = ["/user/login", "/user/reg"];

// token验证函数(jwtCheck)
const jwtCheck = (req, res, next) => {
  if (arr.indexOf(req.originalUrl) !== -1) {
    // 表示如果是登录或者注册，则直接放行
    next();
  } else {
    // 前端headers传来的token值:
    const token = req.headers.token;

    jwt.verify(token, jwtKey, (err, data) => {
      // 由后端进行token的判断
      if (err) {
        res.json({
          status: 401,
          msg: "token已失效,请重新刷新进行登录！",
        });
      } else {
        // token有效之后，则将token再次进行解密，拿到真实数据再进行判断
        req.uid = data.data;
        next();
      }
    });
  }
};

module.exports = {
  jwtSign,
  jwtCheck,
};
