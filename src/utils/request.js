import axios from 'axios'

const setReqConfig = axiosConfig => {
  const service = axios.create({
    // baseURL: 'https://netease-cloud-music-api-fawn-ten.vercel.app',
    timeout: 15000,
    withCredentials: true
  })

  // 请求拦截器
  service.interceptors.request.use(config => {
    return config
  }, error => {
    return Promise.reject(error)
  })

  // 响应拦截器
  service.interceptors.response.use(response => {
    return response
  }, error => {
    return Promise.reject(error)
  })

  return service(axiosConfig)
}

export default setReqConfig
