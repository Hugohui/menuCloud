// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// collection 上的 get 方法会返回一个 Promise，因此云函数会在数据库异步取完数据后返回结果
exports.main = async (event, context) => db.collection('users').where({
                 _openid: event.openid
               }).get();
