import setReqConfig from '../utils/request'

const realIP = '116.25.146.177'

class loginAPI {
  // 手机登陆
  loginByCellphone (data) {
    data.realIP = realIP
    return setReqConfig({ url: '/mb/login/cellphone', data, method: 'POST', responseType: 'json' })
  }
  // 邮箱登陆
  loginByEmail (data) {
    data.realIP = realIP
    return setReqConfig({ url: '/mb/login', data, method: 'POST', responseType: 'json' })
  }
  // 二维码登陆---二维码key生成
  loginByQrKey (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({ url: '/mb/login/qr/key', params, method: 'GET', responseType: 'json' })
  }
  // 二维码登陆---二维码生成
  loginByQrCreate (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({ url: '/mb/login/qr/create', params, method: 'GET', responseType: 'json' })
  }
  // 二维码登陆--二维码检测扫码状态
  loginByQrCheck (params) {
    params.realIP = realIP
    params.timestamp = new Date().getTime()
    return setReqConfig({ url: '/mb/login/qr/check', params, method: 'GET', responseType: 'json' })
  }
  // 刷新登陆
  loginByRefresh (data) {
    data.realIP = realIP
    return setReqConfig({ url: '/mb/captcha/sent', data, method: 'POST', responseType: 'json' })
  }
  // 发送验证码
  CaptchaBySent (data) {
    data.realIP = realIP
    return setReqConfig({ url: '/mb/captcha/sent', data, method: 'POST', responseType: 'json' })
  }
  // 验证验证码
  CaptchaByVerify (data) {
    data.realIP = realIP
    return setReqConfig({ url: '/mb/captcha/verify', data, method: 'POST', responseType: 'json' })
  }
  // 登陆状态
  loginStatus (data) {
    data.realIP = realIP
    return setReqConfig({ url: '/mb/login/status', data, method: 'POST', responseType: 'json' })
  }
  // 退出登陆
  logout (data) {
    data.realIP = realIP
    return setReqConfig({ url: '/mb/logout', data, method: 'POST', responseType: 'json' })
  }
}

export default loginAPI