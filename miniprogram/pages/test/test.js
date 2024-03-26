import instance from '../../utils/http'

// pages/test/test.js
Page({
  /**
   * 页面的初始数据
   */
  data: {},
  async handler() {
    // 通过实例调用 request 方法发送请求
    const res = await instance.get('cart/getCartList11', { test: 111 }, { timeout: 2000 }).console.log(res)
  },
  async handler1() {},
  async allHandler() {
    const res = await instance.all(instance.get('index/findBanner'), instance.get('index/findCategory1'))
    console.log(res)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
})
