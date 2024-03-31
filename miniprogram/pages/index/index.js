import { reqIndexData } from '../../api/index.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], // 轮播图数据
    categoryList: [], // 分类数据
    activeList: [], // 活动广告
    hotList: [], // 人气推荐
    guessList: [], // 猜你喜欢
    loading: true // 数据是否加载完毕
  },
  // 获取首页数据
  async getIndexData() {
    // 调用接口，获取首页数据
    // 数组每一项是 Promise 产生的结果，并且是按照顺序返回。
    const res = await reqIndexData()
    // 在获取数据以后，对数据进行赋值
    this.setData({
      bannerList: res[0].data,
      categoryList: res[1].data,
      activeList: res[2].data,
      hotList: res[3].data,
      guessList: res[4].data,
      loading: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 调用获取首页数据的回调// 调用获取首页数据的回调
    this.getIndexData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '所有的怦然心动,都是你',
      path: '/miniprogram/pages/index/index',
      imageUrl: '../../assets/images/love.jpg'
    }
  },
  /**
   * 转发到朋友圈功能
   */
  onShareTimeline() {}
})
