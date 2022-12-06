import setReqConfig from '../utils/request'

const realIP = '116.25.146.177'

class userinfoAPI {
  // 获取用户歌单
  getPlayList (data) {
    data.realIP = realIP
    return setReqConfig({ url: '/mb/user/playlist', data, method: 'POST', responseType: 'json' })
  }
}

export default userinfoAPI