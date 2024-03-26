/**
 * 封装消息提示组件
 * @param {Object} options 配置对象。
 * @param {string} options.title 提示的标题，默认为'数据加载中...'.
 * @param {string} options.icon 显示的图标，可以是'none'、'success'、'fail'等，默认为'none'.
 * @param {number} options.duration 显示持续的时间，单位毫秒，默认为2000.
 * @param {boolean} options.mask 是否显示蒙层，默认为true。
 * @returns 无返回值。
 */
export const toast = ({ title = '数据加载中...', icon = 'none', duration = 2000, mask = true } = {}) => {
  wx.showToast({
    title,
    icon,
    duration,
    mask
  })
}

// 封装wx.showModal
export const modal = (options = {}) => {
  // 返回一个Promise实例
  return new Promise((resolve, reject) => {
    // 定义默认的选项
    const defaultOpt = {
      title: '提示',
      content: '您确定执行该操作吗？',
      confirmColor: '#f3514f'
    }
    // 合并默认选项和传入的选项
    // const opts = Object.assign({}, defaultOpt, options)
    const opts = { ...defaultOpt, ...options }
    // 显示模态框
    wx.showModal({
      // 模态框的属性
      ...opts,
      // 模态框显示后的回调函数
      complete: ({ confirm, cancel }) => {
        // 如果用户点击确定按钮，则resolve为true
        confirm && resolve(true)
        // 如果用户点击取消按钮，则resolve为false
        cancel && resolve(false)
      }
    }).catch((error) => {
      // 捕获错误，reject传入error
      reject(error)
    })
  })
}

// 将toast函数添加到wx对象中，方便在其他地方调用
wx.toast = toast
wx.modal = modal
