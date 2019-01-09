// pages/login/login.js
var api = require('../../api/api.js');
const app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Get userinfo
   */
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      this.onGetOpenidSaveInfo(e.detail.userInfo);
    }
  },

  /**
   * Save the user information to the DB
   */
  onGetOpenidSaveInfo: function(userInfo) {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {
        userInfo: userInfo
      },
      success: res => {
        app.globalData.openid = res.result.openid
        const db = wx.cloud.database();
          db.collection('users').where({
            _openid: res.result.openid
          }).get({
            success: res => {
              if(res.data.length == 0){
                db.collection('users').add({
                  data: userInfo,
                  success: res => {
                    console.log('add user success');
                  },
                  fail: err => {
                    console.log('add user fail, error message:'+err);
                  }
                })
              }else{
                console.log('user is already exist');
              }
            },
            fail: err => {
              console.error('get user info fail, error message:', err);
            },
            complete: ()=>{
              wx.showToast({
                title: '登录成功'
              });
              setTimeout(()=>{
                wx.reLaunch({
                  url: '../../pages/index/index'
                });
              },800);
            }
          })
      },
      fail: err => {
        console.error('login function call failed,error message: ', err);
      }
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})
