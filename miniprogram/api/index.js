import http from '../utils/http'
/**
 * 用来获取首页轮播图数据
 * @returns
 */
export const reqSwiperData = () => {
  return http.get('/index/findBanner')
}
