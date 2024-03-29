import http from '../utils/http'

/**
 * @description 获取商品列表
 * @return Promise
 */
export const reqGoodsList = ({ limit, page, ...data }) => {
  return http.get(`/goods/list/${page}/${limit}`, data)
}

/**
 * @description 获取商品详情
 * @param {*} goodsId 商品Id
 * @returns Promise
 */
export const reqGoodsInfo = (goodsId) => {
  return http.get(`/goods/${goodsId}`)
}
