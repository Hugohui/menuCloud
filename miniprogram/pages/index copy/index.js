//index.js
var api = require('../../api/api.js');
const app = getApp();

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  queryCook: function queryCook() {
      let res = api.queryCook({
        menu:"锅包肉",
        rn:100,
        pn:1
      }).then((res)=>{
        if(res.data.error_code == 0){
          let relData = res.data.result.data;
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

  onLoad: function() {
    this.queryCook();
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
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      this.onGetOpenid(e.detail.userInfo);
    }
  },

  onGetOpenid: function(userInfo) {
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
                    console.log('success');
                  },
                  fail: err => {
                  }
                })
              }else{
                console.log('already exist');
              }
            },
            fail: err => {
              console.log(err);
            }
          })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
