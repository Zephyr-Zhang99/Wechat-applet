import './utils/extendApi.js'
App({
  onShow() {
    const accountInfo = wx.getAccountInfoSync()
    console.log(accountInfo)
  }
})
