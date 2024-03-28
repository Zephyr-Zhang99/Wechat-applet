import { reqAddressList, reqDelAddress } from '../../../../../api/address.js'
import { swipeCellBehavior } from '../../../../../behavior/swipeCell.js'

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
  onLoad() {
    this.getAddressList()
  },
  onShow() {
    this.getAddressList()
  }
})
