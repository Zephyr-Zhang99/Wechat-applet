import Schema from 'async-validator'
import { reqAddAddress, reqAddressInfo, reqUpdateAddress } from '../../../api/address'
import QQMapWX from '../../../libs/qqmap-wx-jssdk.min.js'
Page({
  // 页面的初始数据
  data: {
    name: '', // 收货人
    phone: '', // 手机号
    provinceName: '', // 省
    provinceCode: '', // 省 编码
    cityName: '', // 市
    cityCode: '', // 市 编码
    districtName: '', // 区
    districtCode: '', // 区 编码
    address: '', // 详细地址
    fullAddress: '', // 完整地址 (省 + 市 + 区 + 详细地址)
    isDefault: false // 设置默认地址，是否默认地址 → 0：否  1：是
  },
  onLoad(options) {
    // 实例化API核心类
    // 需要配置账户额度
    this.qqmapwx = new QQMapWX({
      key: '申请的Key'
    })
    // 回显收货地址逻辑
    this.showAddressInfo(options.id)
  },

  // 保存收货地址
  async saveAddrssForm(event) {
    // 解构出省市区以及 是否是默认地址
    const { provinceName, cityName, districtName, address, isDefault } = this.data
    // 拼接完整的地址
    const fullAddress = provinceName + cityName + districtName + address
    // 合并接口请求参数
    const params = {
      ...this.data,
      fullAddress,
      isDefault: isDefault ? 1 : 0
    }
    // 调用方法对最终的请求参数进行验证
    const { valid } = await this.validateAddress(params)
    // 如果验证没有通过，不继续执行后续的逻辑
    if (!valid) return
    const res = this.addressId ? await reqUpdateAddress(params) : await reqAddAddress(params)
    if (res.code === 200) {
      // 提示用户更新状态
      wx.toast({
        title: this.addressId ? '编辑收货地址成功' : '新增收货地址成功'
      })
      // 返回到收货地址列表页面
      wx.navigateBack()
    }
  },

  // 省市区选择
  onAddressChange(event) {
    const [provinceCode, cityCode, districtCode] = event.detail.code
    const [provinceName, cityName, districtName] = event.detail.value
    this.setData({ provinceCode, provinceName, cityCode, cityName, districtName, districtCode })
  },
  // 获取用户地理位置信息
  async onLocation() {
    // 获取当前的地理位置 (经度、纬度、高度等)
    // const res = await wx.getLocation()
    // console.log(res)

    // 打开地图让用户选择地理位置
    // latitude 纬度、longitude 经度、name 搜索的地点
    const { latitude, longitude, name } = await wx.chooseLocation()

    // 使用 reverseGeocoder 方法进行逆地址解析
    this.qqmapwx.reverseGeocoder({
      location: {
        longitude,
        latitude
      },
      success: (res) => {
        // 获取省市区、省市区编码
        const { adcode, province, city, district } = res.result.ad_info

        // 获取街道、门牌 (街道、门牌 可能为空)
        const { street, street_number } = res.result.address_component

        // 获取标准地址
        const { standard_address } = res.result.formatted_addresses

        // 对获取的数据进行格式化、组织，然后赋值给 data 中的字段
        this.setData({
          // 省
          provinceName: province,
          // 如果是省，前 2 位有值，后面 4 位是 0
          provinceCode: adcode.replace(adcode.substring(2, 6), '0000'),

          // 市
          cityName: city,
          // 如果是市，前 4 位有值，后面 2 位是 0
          cityCode: adcode.replace(adcode.substring(4, 6), '00'),

          // 区
          // 东莞市、中山市、儋州市、嘉峪关市 因其下无区县级
          districtName: district,
          districtCode: district && adcode,

          // 详细地址以及完整地址，在以后开发中根据产品的需求来进行选择、处理即可
          // 组织详细地址
          address: street + street_number + name,
          // 组织完整地址
          fullAddress: standard_address + name
        })
      }
    })
  },
  // 验证
  validateAddress(params) {
    // 验证收货人，是否只包含大小写字母、数字和中文字符
    const nameRegExp = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$'

    // 验证手机号
    const phoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$'
    // 创建验证规则，验证规则是一个对象
    // 每一项是一个验证规则，验证规则属性需要和验证的数据进行同名
    const rules = {
      name: [
        { required: true, message: '请输入收货人姓名' },
        { pattern: nameRegExp, message: '收货人姓名不合法' }
      ],
      phone: [
        { required: true, message: '请输入收货人手机号' },
        { pattern: phoneReg, message: '手机号不合法' }
      ],
      provinceName: { required: true, message: '请选择收货人所在地区' },
      address: { required: true, message: '请输入详细地址' }
    }
    // 创建验证实例，并传入验证规则
    const validator = new Schema(rules)
    // 调用实例方法对数据进行验证
    // 注意：我们希望将验证结果通过 Promsie 的形式返回给函数的调用者
    return new Promise((resolve) => {
      validator.validate(params, (errors, fields) => {
        if (errors) {
          wx.toast({
            title: errors[0].message
          })
          resolve({ valid: false })
        } else {
          resolve({ valid: true })
        }
      })
    })
  },
  // 回显收货地址逻辑
  async showAddressInfo(id) {
    // 判断是否存在 id，如果不存在 id，return 不执行后续的逻辑
    if (!id) return
    // 如果存在 id，将 id 挂载到 this 页面实例上
    this.addressId = id
    // 动态设置当前页面的标题
    wx.setNavigationBarTitle({
      title: '更新收货地址'
    })
    // 调用方法获取收货地址详细信息
    const { data } = await reqAddressInfo(this.addressId)
    // 将获取的数据进行赋值
    this.setData(data)
  }
})
