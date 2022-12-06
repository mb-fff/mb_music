import setReqConfig from '../utils/request'

const realIP = '116.25.146.177'

class musicLibrary {
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
    return setReqConfig({ url: '/mb/banner', data, method: 'POST', responseType: 'json' })
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
  getNewSongData (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({ url: '/mb/personalized/newsong', params, method: 'POST', responseType: 'json' })
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
  // 获取所有榜单
  getToplist (data) {
    data.realIP = realIP
    return setReqConfig({ url: '/mb/toplist', data, method: 'POST', responseType: 'json' })
  }
  // 获取歌手列表
  getSingerList (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({ url: '/mb/artist/list', params, method: 'GET', responseType: 'json' })
  }
  // 获取歌手热门50首歌曲
  getMusicOfSingerById (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({ url: '/mb/artist/top/song', params, method: 'GET', responseType: 'json' })
  }
  // 获取歌手详情
  getSingerDetail (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({ url: '/mb/artist/detail', params, method: 'GET', responseType: 'json' })
  }
  // 新歌速递
  getNewMusic (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({ url: '/mb/top/song', params, method: 'GET', responseType: 'json' })
  }
  // 新碟上架
  getNewAlbum (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({ url: '/mb/top/album', params, method: 'GET', responseType: 'json' })
  }
  // 获取专辑列表
  getAlbumList (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({ url: '/mb/album', params, method: 'GET', responseType: 'json' })
  }
  // 歌单分类
  getCatlist () {
    return setReqConfig({
      url: '/mb/playlist/catlist',
      method: 'GET',
      params: realIP
    })
  }
  // 获取精品歌单
  getHighquality (params) {
    params.realIP = realIP
    return setReqConfig({
      url: '/mb/top/playlist/highquality',
      method: 'GET',
      params,
      responseType: 'json'
    })
  }
  // 获取热门歌单分类
  getHotList () {
    return setReqConfig({
      url: '/mb/playlist/hot',
      method: 'GET',
      params: realIP
    })
  }
  // 获取网友精选碟歌单
  getplaylist (params) {
    return setReqConfig({
      url: '/mb/top/playlist',
      method: 'GET',
      params,
      responseType: 'json'
    })
  }
  // 获取用户详情
  getUser (params) {
    return setReqConfig({
      url: `/user/detail?uid=${params}`,
      method: 'GET',
      responseType: 'json'
    })
  }
  // 获取歌单详情
  getListDetail (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({
      url: `/playlist/detail`,
      params,
      method: 'GET',
      responseType: 'json'
    })
  }
  // 获取歌单收藏者
  getSubscribers (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({
      url: `/playlist/subscribers`,
      params,
      method: 'GET',
      responseType: 'json'
    })
  }
  // 获取歌单评论
  getComment (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({
      url: `/comment/playlist`,
      params,
      method: 'GET',
      responseType: 'json'
    })
  }
  // 获取热门评论
  gethotComment (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({
      url: `/comment/hot`,
      params,
      method: 'GET',
      responseType: 'json'
    })
  }
  // 获取精品歌单标签列表
  getHighTags (params = {}) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({
      url: `/playlist/highquality/tags`,
      params,
      method: 'GET',
      responseType: 'json'
    })
  }
}

export default musicLibrary
