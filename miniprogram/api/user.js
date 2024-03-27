import http from '../utils/http.js'

/**
 * 授权登录
 * @param {*} code 临时登录凭证
 * @returns
 */
export const reqLogin = (code) => {
  return http.get(`/weixin/wxLogin/${code}`)
}

/**
 * 获取用户信息
 * @returns
 */
export const reqUserInfo = () => {
  return http.get(`/weixin/getuserInfo`)
}

/**
 * 本地资源上传
 * @param {*} filePath  文件资源路径
 * @param {*} name 文件对应key
 * @returns
 */
export const reqUploadFile = (filePath, name) => {
  return http.upload('/fileUpload', filePath, name)
}

/**
 * 更新用户信息
 * @param {*} updateUser 用户头像和用户昵称
 * @returns
 */
export const reqUpdateUserInfo = (updateUser) => {
  return http.post('/weixin/updateUser', updateUser)
}
