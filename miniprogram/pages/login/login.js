// 导入 ComponentWithStore 方法，这个方法用于将 mobx store 绑定到组件上
import { ComponentWithStore } from 'mobx-miniprogram-bindings'

// 导入用于登录的 API 函数
import { reqLogin, reqUserInfo } from '../../api/user'

// 导入用户相关的 store
import { userStore } from '../../store/userstore.js'

// 导入用于提示用户的工具函数
import { toast } from '../../utils/extendApi'

// 导入本地存储工具函数
import { setStorage } from '../../utils/storage'

// 使用 ComponentWithStore 方法替换默认的 Component 方法来构造页面
ComponentWithStore({
  // 定义 storeBindings，用于绑定 store 到组件
  storeBindings: {
    // 指定要绑定的 store
    store: userStore,
    // 指定要从 store 中绑定的字段
    fields: ['token', 'userInfo'],
    // 指定要从 store 中绑定的 actions
    actions: ['setToken', 'setUserInfo']
  },
  methods: {
    // 定义登录方法
    login() {
      // 调用微信登录 API 来获取用户登录凭证（code）
      wx.login({
        success: async ({ code }) => {
          // 如果有 code，则继续进行登录流程
          if (code) {
            // 调用后端接口 API，传入 code 进行登录
            const { data } = await reqLogin(code)
            // 登录成功后，将 token 存储到本地存储中
            setStorage('token', data.token)
            // 将 token 存储到 store 对象中，以便于全局使用
            this.setToken(data.token)
            // 获取用户信息
            this.getUserInfo()
            // 返回上级页面
            wx.navigateBack()
          } else {
            // 如果没有 code，表示登录失败，给用户提示
            toast({ title: '授权失败,请重新授权' })
          }
        }
      })
    },
    // 获取用户信息
    async getUserInfo() {
      const { data } = await reqUserInfo()
      // 将用户信息存储到本地
      setStorage('userInfo', data)
      // 将用户信息存储到 Store
      this.setUserInfo(data)
    }
  }
})
