import setReqConfig from '../utils/request'

const realIP = '116.25.146.177'

class videoLibrary {
  // 获取全部视频列表
  getAllVideo (data) {
    data.realIP = realIP
    return setReqConfig({ url: '/mb/video/timeline/all', data, method: 'POST', responseType: 'json' })
  }
  // 获取视频标签列表
  getVideoGroupList (data) {
    data.realIP = realIP
    return setReqConfig({ url: '/mb/video/group/list', data, method: 'POST', responseType: 'json' })
  }
  // 获取视频分类列表
  getVideoCategoryList (data) {
    data.realIP = realIP
    return setReqConfig({ url: '/mb/video/category/list', data, method: 'POST', responseType: 'json' })
  }
  // 获取视频标签/分类下的视频
  getVideoGroupAndCategoryById (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({ url: '/mb/video/group', params, method: 'GET', responseType: 'json' })
  }
  // 获取视频详情
  getVideoDetail (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({ url: '/mb/video/detail', params, method: 'GET', responseType: 'json' })
  }
  // 获取视频地址
  getVideoUrl (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({ url: '/mb/video/url', params, method: 'GET', responseType: 'json' })
  }
  // 获取全部mv
  getAllMV (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({ url: '/mb/mv/all', params, method: 'GET', responseType: 'json' })
  }
  // 获取最新mv
  getLateMv (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({ url: '/mb/mv/first', params, method: 'GET', responseType: 'json' })
  }
  // 获取mv数据
  getMvDetail (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({ url: '/mb/mv/detail', params, method: 'GET', responseType: 'json' })
  }
  // 获取mv地址
  getMvUrl (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({ url: '/mb/mv/url', params, method: 'GET', responseType: 'json' })
  }
}

export default videoLibrary
