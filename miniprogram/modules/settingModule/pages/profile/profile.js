// pages/profile/profile.js
import { reqUpdateUserInfo, reqUploadFile } from '../../../../api/user.js'
import { toast } from '../../../../utils/extendApi.js'
import { setStorage } from '../../../../utils/storage.js'
import { userBehavior } from './behavior.js'

Page({
  behaviors: [userBehavior],
  // 页面的初始数据
  data: {
    isShowPopup: false // 控制更新用户昵称的弹框显示与否
  },
  // 更新用户头像
  async chooseAvatar(event) {
    // 获取头像的临时路径
    // 临时路径具有失效时间，需要将临时路径上传到公司的服务器，获取永久的路径
    // 在获取永久路径以后，需要使用永久路径更新 headimgurl+     // 用户点击 保存按钮，才算真正的更新了头像和昵称
    const { avatarUrl } = event.detail
    const res = await reqUploadFile(avatarUrl, 'file')
    this.setData({
      'userInfo.headimgurl': res.data
    })
  },
  // 更新用户信息
  async updateUserInfo() {
    const res = await reqUpdateUserInfo(this.data.userInfo)
    if (res.code === 200) {
      // 用户信息更新成功后将最新的数据存储本地
      setStorage('userInfo', this.data.userInfo)
      // 并同步store
      this.setUserInfo(this.data.userInfo)
      // 提示用户
      toast({ title: '用户信息更新成功' })
    }
  },
  // 获取用户昵称
  getNewName(event) {
    const { nickname } = event.detail.value
    this.setData({
      'userInfo.nickname': nickname,
      isShowPopup: false
    })
  },
  // 显示修改昵称弹框
  onUpdateNickName() {
    this.setData({
      isShowPopup: true,
      'userInfo.nickname': this.data.userInfo.nickname
    })
  },

  // 弹框取消按钮
  cancelForm() {
    this.setData({
      isShowPopup: false
    })
  }
})
