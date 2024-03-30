import './utils/extendApi.js'
App({
  // 定义全局共享数据
  //   点击收货地址时,需要将点击的收货地址赋值给address
  //   在结算支付 订单结算页面需要判断address是否存在数据。
  //   如果存在数据就简就展示address数据,如果没有数据，就从接口获取数据进行渲染
  globalData: {
    address: {}
  }
})
