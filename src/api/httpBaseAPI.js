import setReqConfig from '../utils/request'

const realIP = '116.25.146.177'

class httpBaseAPI {
  // 搜索音乐
  searchMusic (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({ url: '/mb/cloudsearch', params, method: 'GET', responseType: 'json' })
  }
  // 热搜榜音乐
  searchHotMusic (data) {
    data.realIP = realIP
    return setReqConfig({ url: '/mb/search/hot/detail', data, method: 'POST', responseType: 'json' })
  }
}

export default httpBaseAPI