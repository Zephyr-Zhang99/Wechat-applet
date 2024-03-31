// 导入 BehaviorWithStore 让页面和 Store 对象建立关联
import { userStore } from '@/store/userstore'
// 导入用户 Store
import { BehaviorWithStore } from 'mobx-miniprogram-bindings'
export const userBehavior = BehaviorWithStore({
  storeBindings: {
    store: userStore,
    fields: ['token']
  }
})
