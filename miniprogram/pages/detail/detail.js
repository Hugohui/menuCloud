// pages/detail/detail.js
Page({

  /**
   * Page initial data
   */
  data: {
    detail: null,
    burden: [],
    ingredients: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const detail = JSON.parse(options.item);
    this.setData({
      detail: detail,
      ingredients: detail.ingredients.split(';'),
      burden: detail.burden.split(';')
    });
    wx.setNavigationBarTitle({
      title: detail.title
    });
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
