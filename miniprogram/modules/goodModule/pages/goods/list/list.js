// pages/goods/list/index.js
import { reqGoodsList } from '../../../api/goods'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [], // 商品列表数据
    isFinish: false, // 判断数据是否加载完毕
    isLoading: false, // 判断数据是否加载完毕
    total: 0, //数据总条数
    // 请求参数
    requestData: {
      page: 1, //页码
      limit: 10, // 每页请求多少条数据
      category1Id: '', // 一级分类id
      category2Id: '' // 二级分类id
    }
  },
  // 获取商品列表的数据
  async getGoodsList() {
    // 数据真正请求中
    this.data.isLoading = true
    // 调用API获取数据
    const { data } = await reqGoodsList(this.data.requestData)
    // 数据加载完毕
    this.data.isLoading = false
    // 将返回的数据赋值给 data 中的变量
    this.setData({
      goodsList: [...this.data.goodsList, ...data.records],
      total: data.total
    })
  },
  // 生命周期函数-- 监听页面加载
  onLoad(options) {
    Object.assign(this.data.requestData, options)
    // 获取商品列表的数据
    this.getGoodsList()
  },
  // 监听页面的上拉操作
  onReachBottom() {
    let { requestData, goodsList, total, isLoading } = this.data
    let { page } = requestData
    // 判断是否加载完毕,如果isLoading等于true
    // 说明数据还没有加载完毕,不加载下一页数据
    if (isLoading) return
    // 判断数据是否加载完毕
    if (total === goodsList.length) {
      // 如果相等,数据加载完毕
      // 如果数据加载完毕,需要给用户提示,同时不继续加载下一个数据
      this.setData({
        isFinish: true
      })
      return
    }
    // 页码 + 1
    this.setData({
      requestData: { ...this.data.requestData, page: page + 1 }
    })
    // 重新发送请求
    this.getGoodsList()
  },
  // 监听页面的下拉刷新
  onPullDownRefresh() {
    // 将数据从重置
    this.setData({
      goodsList: [],
      total: 0,
      isFinish: false,
      requestData: { ...this.data.requestData, page: 1 }
    })
    // 使用最新参数重新发送请求
    this.getGoodsList()
    // 手动关闭下拉刷新
    wx.stopPullDownRefresh()
  }
})
