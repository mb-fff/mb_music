/**
 * @param {*} origin 音乐时长(s)
 * @returns 分秒格式化为'00:00'
 */
const formatMusicTime = origin => {
  if (origin === 0) return '00:00'
  // 分，秒
  const [m, s] = [Math.floor(origin / 60), origin % 60]
  return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
}

/**
 * @param {*} origin 播放量
 * @returns 格式化为单位万
 */
const playCountFormat = origin => {
  if (!origin) return
  origin = origin.toString()
  return origin.length > 5 ? origin.slice(0, origin.length - 4) + '万' : origin
}


/*
* 日期转换为 yyyy-MM-dd格式
* */
const dateFormat = (date, format = 'yyyy-MM-dd') => {
  // 获取时间
  if (!date) {
    return ''
  }
  
  const value = new Date(date)
  const yearD = value.getFullYear()
  const monthD = (value.getMonth() + 1) < 10 ? '0' + (value.getMonth() + 1) : value.getMonth() + 1
  const dayD = (value.getDate() < 10) ? '0' + value.getDate() : value.getDate()
  const hourD = (value.getHours() < 10) ? '0' + value.getHours() : value.getHours()
  const minuteD = (value.getMinutes() < 10) ? '0' + value.getMinutes() : value.getMinutes()
  const secondD = (value.getSeconds() < 10) ? '0' + value.getSeconds() : value.getSeconds()

  // 替换格式
  if (format.indexOf('yyyy') !== -1) format = format.replace('yyyy', yearD)
  if (format.indexOf('MM') !== -1) format = format.replace('MM', monthD)
  if (format.indexOf('dd') !== -1) format = format.replace('dd', dayD)
  if (format.indexOf('hh') !== -1) format = format.replace('hh', hourD)
  if (format.indexOf('mm') !== -1) format = format.replace('mm', minuteD)
  if (format.indexOf('ss') !== -1) format = format.replace('ss', secondD)
  return format
}

export default {
  formatMusicTime,
  playCountFormat,
  dateFormat
}