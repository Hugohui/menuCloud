const request = require('../utils/request');
const cookApi = 'https://apis.juhe.cn/';
const cookKey = '158268ae2757f14cac9fa1ff547846be'
const queryCook = (params)=> request.get(params,cookApi+'cook/query?key='+cookKey);

module.exports = {
  queryCook
}
