const get = function(params = {}, url){
  var p = new Promise(function(resolve, reject){
      let res = wx.request({
         url: url,
         method: 'get',
         data: params,
         header: { 'Content-Type': 'application/json'},
         success: (res)=>{
           resolve(res)
         },
         fail: (res)=>{
           reject(res);
         }
       });
    });
    return p;
}

const post = function(params = {}, url){
  var p = new Promise(function(resolve, reject){
      let res = wx.request({
         url: url,
         method: 'post',
         data: params,
         header: { 'Content-Type': 'application/json'},
         success: (res)=>{
           resolve(res)
         },
         fail: (res)=>{
           reject(res);
         }
       });
    });
    return p;
}


module.exports =  {
  get,
  post
}
