import http from '../utils/http.js'
/**
 * 获取商品分类的数据
 * @returns promise
 */
export const reqCategoryData = () => {
  return http.get('/index/findCategoryTree')
}
