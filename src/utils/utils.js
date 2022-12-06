/**
 * 公共方法
 */

// 节流函数
export const throttle = (fn, wait) => {
  let t = null
  return function (...arg) {
    if (!t) {
      t = setTimeout(() => {
        fn(...arg)
        t = null
      }, wait)
    }
  }
}