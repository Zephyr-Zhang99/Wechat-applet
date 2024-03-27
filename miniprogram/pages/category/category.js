import { reqCategoryData } from '../../api/category'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    categoryList: [], // 分类数据列表
    activeIndex: 0 // 当前选中的分类索引
  },
  // 获取页面初始化时，页面中使用的数据
  async getCategoryData() {
    const res = await reqCategoryData()
    this.setData({
      categoryList: res.data
    })
  },
  //   导航分类点击事件
  updateActive(e) {
    this.setData({
      activeIndex: e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCategoryData()
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
  onShareAppMessage: function () {}
})
