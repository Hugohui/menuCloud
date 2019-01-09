// 云函数入口函数
exports.main = (event, context) => {
  return {
    "error_code": 0,
    "data": [{
      "text": event.text
    }]
  }
}