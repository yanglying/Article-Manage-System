const showTime = () => {
  const date = new Date();
  // 年月日
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  // 时分秒
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  // 实时显示
  return (
    year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
  );
};

// 生成标准的uuid，且使用了随机种子，用于实现用户标识
const uidFn = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
module.exports = {
  showTime,
  uidFn,
};
