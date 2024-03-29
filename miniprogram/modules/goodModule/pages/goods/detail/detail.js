import { reqAddGood, reqCartList } from '@/api/cart.js'
import { reqGoodsInfo } from '@/api/goods'
import { userBehavior } from '@/behavior/userBehavior'
// pages/goods/detail/index.js
Page({
  behaviors: [userBehavior],
  // 页面的初始数据
  data: {
    goodsInfo: {}, // 商品详情
    show: false, // 控制加入购物车和立即购买弹框的显示
    count: 1, // 商品购买数量，默认是 1
    blessing: '', // 祝福语
    buyNow: 0, // 控制加入购物车还是立即购买 0 加入购物车 1 立即购买
    allCount: '' // 后无车商品总数量
  },

  // 加入购物车
  handleAddcart() {
    this.setData({
      show: true,
      buyNow: 0
    })
  },

  // 立即购买
  handeGotoBuy() {
    this.setData({
      show: true,
      buyNow: 1
    })
  },

  // 点击关闭弹框时触发的回调
  onClose() {
    this.setData({ show: false })
  },

  // 监听是否更改了购买数量
  onChangeGoodsCount(event) {
    this.setData({
      count: Number(event.detail)
    })
  },
  // 弹框的确定按钮
  async handerSubmit() {
    // 解构获取数据
    const { token, count, blessing, buyNow } = this.data
    // 获取商品id
    const goodsId = this.goodsId
    // 如果没有 token ，跳转登录页面
    if (!this.data.token) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }
    // 加入购物车
    if (buyNow === 0) {
      const res = await reqAddGood({ goodsId, count, blessing })
      if (res.code === 200) {
        wx.toast({ title: '加入购物车成功', icon: 'success', mask: false })
        // 购物车购买数量合计
        this.getCartCount()
        this.setData({
          show: false
        })
      }
    } else {
      // 立即购买
      wx.navigateTo({
        url: `/pages/order/detail/index?goodsId=${goodsId}&blessing=${blessing}`
      })
    }
  },
  // 预览商品图片
  previewImg() {
    // 调用预览图片API
    wx.previewImage({
      urls: this.data.goodsInfo.detailList // // 需要预览的图片 http 链接列表
    })
  },
  //获取商品详情数据
  async getGoodsInfo() {
    // 调用接口、传入参数、获取商品详情
    const { data: goodsInfo } = await reqGoodsInfo(this.goodsId)
    // 将商品详情数据赋值给 data 中的变量
    this.setData({
      goodsInfo
    })
  },
  // 计算购买数量
  async getCartCount() {
    // 如果没有 token ，说明用户是第一次访问小程序，没有进行登录过
    if (!this.data.token) return
    // 获取购物的商品
    const res = await reqCartList()
    if (res.data.length !== 0) {
      // 购物车商品累加
      let allCount = 0
      // 获取购物车商品数量
      res.data.forEach((item) => {
        allCount += item.count
      })
      this.setData({
        // 展示的数据要求是字符串
        allCount: (allCount > 99 ? '99+' : allCount) + ''
      })
    }
  },
  // 生命周期函数--监听页面加载
  onLoad(options) {
    // 将商品id挂载到页面示例上
    this.goodsId = options.goodsId ? options.goodsId : ''
    // 获取详情数据
    this.getGoodsInfo()
    // 计算购买数量
    this.getCartCount()
  }
})
