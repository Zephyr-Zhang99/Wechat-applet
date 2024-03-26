// 创建 WxRequest 类
class WxRequest {
  // 定义实例属性,用来设置默认请求参数
  default = {
    baseURL: '', //请求基准地址
    url: '', //接口请求地址
    data: null, //请求参数
    method: 'GET', //默认请求方式
    // 请求头
    header: {
      'content-type': 'application/json' // 设置数据的交互格式
    },
    timeout: 6000 // 小程序默认超时时间是一分钟
  }

  // 定义拦截器对象
  // 需要包含请求拦截器以及响应拦截器,方便在请求之前以及响应之后进行逻辑会处理
  interceptors = {
    // 在请求发送之前,对请求参数进行新增或者修改
    request: (config) => config,
    // 响应拦截器
    response: (response) => response
  }

  // 用于创建和初始化类的属性和方法
  // 在实例化时传入的参数,会被constructor形参进行接收
  constructor(params = {}) {
    this.default = Object.assign({}, this.default, params)
  }
  /**
   * 发起请求的方法
   * @param {*} options options 请求配置选项，同 wx.request 请求配置选项
   * @returns
   */
  request(options) {
    // 拼接完整的请求地址
    options.url = this.default.baseURL + options.url
    // 合并请求参数
    options = { ...this.default, ...options }

    // 在请求发送之前,调用请求拦截器,新增和修改请求参数
    this.interceptors.request(options)

    // 使用Promise封装异步请求
    return new Promise((resolve, reject) => {
      // 使用 wx.request 发起请求
      wx.request({
        ...options,
        // 接口调用成功的回调函数
        success: (res) => {
          // 不管是成功响应还是失败响应,都需要调用响应拦截器
          // 响应拦截器需要接收服务器响应的数据,然后对数据进行逻辑处理,处理后进行返回
          // 然后通过resolve将返回的数据抛出去

          // 在给响应拦截器传递参数时,需要将请求参数也一起传递
          // 方便进行代码调试或者进行逻辑处理,需要先合并参数
          // 然后将合并的参数传递给响应拦截器

          // 不管是请求失败还是请求成功,都已经将响应的数据传递给了响应拦截器
          // 这时候在合并参数的时候，追加一个属性:isSuccess
          // 如果属性为true,说明执行了success回调函数
          // 如果属性为false,说明执行了fail回调函数
          const mergeRes = Object.assign({}, res, { config: options, isSuccess: true })
          resolve(this.interceptors.response(mergeRes))
        },
        // 接口调用失败的回调函数
        fail: (err) => {
          const mergeErr = Object.assign({}, err, { iconfig: options, isSuccess: false })
          reject(this.interceptors.response)
        }
      })
    })
  }
  /**
   * get请求
   * @param {*} options
   * @returns
   */
  get(url, data = {}, config = {}) {
    //需要调用request方法发送请求,只需要组织好参数,传递给request请求方法即可
    // 当调用get方法时,需要将request方法的返回值return出去
    return this.request(Object.assign({ url, data, method: 'GET' }, config))
  }
  /**
   * Delete请求
   * @param {*} options
   * @returns
   */
  delete(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'DELETE' }, config))
  }
  /**
   * post请求
   * @param {*} options
   * @returns
   */
  post请求(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'POST' }, config))
  }
  /**
   * put请求
   * @param {*} options
   * @returns
   */
  put(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'PUT' }, config))
  }
  // 用来处理并发请求
  all(...promise) {
    // 通过展开运算法接收传递的参数
    // 那么展开运算符会将传入的参数转成数组
    return Promise.all(promise)
  }
}

export default WxRequest
