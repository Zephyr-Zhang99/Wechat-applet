import { userStore } from '@/store/userstore.js'
import { ComponentWithStore } from 'mobx-miniprogram-bindings'
import { reqCartList, reqUpdateChecked } from '../../api/cart'
// pages/cart/component/cart.js

ComponentWithStore({
  storeBindings: {
    store: userStore,
    fields: ['token']
  },

  // 组件的初始数据
  data: {
    cartList: [],
    emptyDes: '还没有添加商品，快去添加吧～'
  },

  // 组件的方法列表
  methods: {
    // 切换商品的选中状态
    async updateChecked(event) {
      // 获取最新的选中状态
      const { detail } = event
      // 获取商品的索引和 id
      const { id, index } = event.target.dataset
      // 将最新的状态格式化成后端所需要的数据格式
      const isChecked = detail ? 1 : 0
      // 调用接口，传入参数，更新商品的状态
      const res = await reqUpdateChecked(id, isChecked)
      if (res.code === 200) {
        this.setData({
          [`cartList[${index}].isChecked`]: isChecked
        })
      }
    },
    // 获取购物车列表数据 + 处理页面的展示
    async showTipGetList() {
      // 将 token 进行解构
      const { token } = this.data
      // 1. 如果没有登录，购物车列表，展示文案：您尚未登录，点击登录获取更多权益
      if (!token) {
        this.setData({
          emptyDes: '您尚未登录，点击登录获取更多权益',
          cartList: []
        })
        return
      }
      // 获取商品列表数据
      const { data: cartList, code } = await reqCartList()
      if (code === 200) {
        // 2. 如果用户登录，购物车列表为空，展示文案： 还没有添加商品，快去添加吧～
        this.setData({
          cartList,
          emptyDes: cartList === 0 && '还没有添加商品，快去添加吧～'
        })
      }
    },
    // 如果使用Component方法构造页面,生命周期函数需要写到methods才可以
    onShow() {
      this.showTipGetList()
    }
  }
})
