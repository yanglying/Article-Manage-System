// 北京时间：2021-11-18 22:14:24
/* 时间yyyy-MM-dd HH:mm:ss转为时间戳 */
export function timeToTimestamp(time) {
  const timestamp = Date.parse(new Date(time).toString());
  // timestamp = timestamp / 1000; //时间戳为13位需除1000，时间戳为13位的话不需除1000

  return timestamp;
  // 2021-11-18 22:14:24的时间戳为：1637244864707
}

export function showTime() {
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
}
