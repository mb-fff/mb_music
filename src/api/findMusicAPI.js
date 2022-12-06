import setReqConfig from '../utils/request'

const realIP = '116.25.146.177'

class findMusicAPI {
  // 根据音乐id获取音乐资源
  getMusicResById (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({ url: '/mb/song/url', params, method: 'GET', responseType: 'json' })
  }
  // 获取歌词
  getlyricById (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({ url: '/mb/lyric', params, method: 'GET', responseType: 'json' })
  }
  // 获取轮播图数据
  getBannerData (data) {
    data.realIP = realIP
    return setReqConfig({ url: '/banner', data, method: 'POST', responseType: 'json' })
  }
  // 获取推荐歌单
  getPlayListData (data) {
    data.realIP = realIP
    return setReqConfig({ url: '/mb/personalized', data, method: 'POST', responseType: 'json' })
  }
  // 根据歌单id获取歌单列表
  getPlayListDetailData (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({ url: '/mb/playlist/detail', params, method: 'GET', responseType: 'json' })
  }
  // 获取每日推荐歌曲
  getEveryDayRecommendMusic (data) {
    data.realIP = realIP
    return setReqConfig({ url: '/mb/recommend/songs', data, method: 'POST', responseType: 'json' })
  }
  // 获取独家放送
  getPrivateContentData (data) {
    data.realIP = realIP
    return setReqConfig({ url: '/mb/personalized/privatecontent', data, method: 'POST', responseType: 'json' })
  }
  // 获取最新音乐
  getNewSongData (data) {
    data.realIP = realIP
    return setReqConfig({ url: '/mb/personalized/newsong', data, method: 'POST', responseType: 'json' })
  }
  // 获取推荐MV
  getMVData (data) {
    data.realIP = realIP
    return setReqConfig({ url: '/mb/personalized/mv', data, method: 'POST', responseType: 'json' })
  }
  // 获取mv地址
  getMvUrl (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({ url: '/mb/mv/url', params, method: 'GET', responseType: 'json' })
  }
}

export default findMusicAPI
