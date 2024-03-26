import { modal, toast } from './extendApi'
import WxRequest from './request'
import { clearStorage, getStorage } from './storage'
// 实例化
const instance = new WxRequest({
  baseURL: 'https://gmall-prod.atguigu.cn/mall-api/',
  timeout: 15000
})
// 配置请求拦截器
instance.interceptors.request = (config) => {
  // 在请求之前做点什么
  //   在发送请求之前,需要先判断本地是否存在token
  const token = getStorage('token')
  // 如果存在token,就需要在请求头中添加token字段
  if (token) {
    config.header['token'] = token
  }
  return config
}
// 配置响应拦截器
instance.interceptors.response = async (response) => {
  // 从 response 中解构 isSuccess
  const { isSuccess, data } = response
  // 如果 isSuccess 为 false，说明执行了 fail 回调函数
  // 这时候就说明网络异常，需要给用户提示网络异常
  if (!isSuccess) {
    wx.showToast({
      title: '网络有异常请重试',
      icon: 'error'
    })
    // 如果请求错误，将错误的结果返回出去
    return response
  }

  // 判断服务器响应的业务状态码
  switch (data.code) {
    // 如果后端返回的业务状态码等于200,请求成功,服务器成功响应数据
    case 200:
      // 简化数据
      return data
    // 如果返回业务状态等于208,说明没有token或者token失效,就需要重新登录
    case 208:
      const res = await modal({
        content: '鉴权失败,请重新登录',
        showCancel: false // 不显示取消按钮
      })
      if (res) {
        //  清除失效token,同时清除本地存储的所有信息
        clearStorage()
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }
      return Promise.reject(response)
    default:
      toast({
        title: '程序出现异常,请联系客服或稍后重试'
      })
      return Promise.reject(response)
      break
  }
}
export default instance
