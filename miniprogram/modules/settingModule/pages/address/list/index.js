import { reqAddressList, reqDelAddress } from '@/api/address.js'
import { swipeCellBehavior } from '@/behavior/swipeCell.js'
// 获取应用实例
const app = getApp()
// pages/address/list/index.js
Page({
  behaviors: [swipeCellBehavior],
  // 页面的初始数据
  data: {
    addressList: []
  },
  async getAddressList() {
    const { data: addressList } = await reqAddressList()
    this.setData({
      addressList
    })
  },
  // 去编辑页面
  toEdit(event) {
    // 需要编辑的收货地址
    const { id } = event.target.dataset
    wx.navigateTo({
      url: `/modules/settingModule/pages/address/add/index?id=${id}`
    })
  },
  // 删除收货地址
  async delAddress(event) {
    const { id } = event.target.dataset
    // 询问用户是否确认删除
    const modalRes = await wx.modal({
      content: '您确定要删除收货地址吗?'
    })
    // 如果确认删除,调用接口api,同时提示
    if (modalRes) {
      await reqDelAddress(id)
      wx.toast({ title: '收货地址删除成功' })
      this.getAddressList()
    }
  },
  // 更新收货地址
  async changeAddress(event) {
    // 需要判断是否是从结算支付页面进入的收货地址列表页面
    // 如果是才能够获取点击的收货地址，否则不执行后续的逻辑,不执行切换收货地址的逻辑。
    if (this.flag !== '1') return
    // 如果是从结算支付页面进入的收货地址列表页面,需要获取点击的收货地址详细信息
    const addressId = event.currentTarget.dataset.id
    // 需要从收货地址列表中根据收货地址ID查找到点击的收货地址详情
    const selectAddress = this.data.addressList.find((item) => item.id === addressId)
    if (selectAddress) {
      // 如果获取收货地址成功以后需要赋值给全局共享的数据。
      app.globalData.address = selectAddress
      wx.navigateBack()
    }
  },
  onLoad(options) {
    // 接收传递的参数挂载到页面的实例上，方便在其他方法中使用
    this.flag = options.flag
    this.getAddressList()
  },
  onShow() {
    this.getAddressList()
  }
})
