//index.js
var api = require('../../api/api.js');
const app = getApp();

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    cookList: null
  },
  prevent(){
    // prevent
  },
  queryCook: function queryCook(params) {
      let res = api.queryCook({
        menu:params.menu,
        rn:params.rn,
        pn:params.pn
      }).then((res)=>{
        if(res.data.error_code == 0){
          let relData = res.data.result.data;
          this.setData({
            cookList: res.data.result.data
          });
          const db = wx.cloud.database();
          let count = 0;
          for(let i = 0;i<relData.length;i++){
            db.collection('cook_lists').where({
              id: relData[i].id
            }).get({
              success: res => {
                if(res.data.length == 0){
                  db.collection('cook_lists').add({
                    data: {
                      id: relData[i].id,
                      title: relData[i].title,
                      tags: relData[i].tags,
                      ingredients: relData[i].ingredients,
                      imtro: relData[i].imtro,
                      burden: relData[i].burden,
                      albums: relData[i].albums,
                      steps: relData[i].steps
                    },
                    success: res => {
                      console.log(count);
                      count++;
                    },
                    fail: err => {
                      console.log(err);
                    }
                  })
                }
              },
              fail: err => {
                console.log(err);
              }
            })
          }
          if(count == relData.length){
            console.log('所有数据存储成功');
          }
        }
      });
  },

  queryCategory:function queryCategory(){
    let res = api.queryCategory().then((res)=>{
      console.log(res);
    })
  },

  toDetal:function(e){
    const item = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '../detail/detail?item='+item
    });
  },

  collectItem:function(e) {
    const item = JSON.stringify(e.currentTarget.dataset.item);
  },

  onShow: function () {
    let queryParams = {
      menu: '家常菜',
      rn: 60,
      pn: 1
    }
    this.queryCook(queryParams);
    // this.queryCategory();
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }else{
          wx.redirectTo({
            url: '../login/login',
          })
        }
      }
    })
  },
})
