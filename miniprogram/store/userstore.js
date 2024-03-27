// 导入 observable 函数用于创建响应式数据
// 导入 函数用来显示的定义action方法
import { action, observable } from 'mobx-miniprogram'
import { getStorage } from '../utils/storage'

// 创建 store 对象，存储应用的状态
export const userStore = observable({
  // 创建响应式状态 token
  token: getStorage('token') || '',
  //   用户信息
  userInfo: getStorage('userInfo') || {},

  // 对 token 进行修改
  setToken: action(function (token) {
    this.token = token
  }),
  //   设置用户信息
  setUserInfo: action(function (userInfo) {
    this.userInfo = userInfo
  })
})
