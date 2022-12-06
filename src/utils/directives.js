/**
 * 自定义指令
 * 通过Vue.directive( id, [definition] ) 方式注册全局指令, 然后在入口文件中使用Vue.use()调用
 * 几个钩子函数
 * bind: 只调用一次，指令第一次绑定到元素时调用，可以定义一个在绑定时执行一次的初始化动作。
 * inserted: 被绑定元素插入父节点时调用（父节点存在即可调用，不必存在于 document 中）。
 * update: 被绑定元素所在的模板更新时调用，而不论绑定值是否变化。通过比较更新前后的绑定值。
 * componentUpdated: 被绑定元素所在模板完成一次更新周期时调用。
 * unbind: 只调用一次， 指令与元素解绑时调用。
 */

// 防抖
const debounce = {
  inserted (fn, timer) {
    let t = null
    return function (...arg) {
      let firstClick = !t
      if (t) {
        clearTimeout(t)
      }
      if (firstClick) {
        fn(...arg)
      }
      t = setTimeout(() => {
        t = null
      }, timer)
    }
  }
}

// 节流
const throttle = {
  inserted (fn, wait) {
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
}

// 拖拽
const draggable = {
  inserted (el) {
    el.style.cursor = 'move'
    el.onmousedown = e => {
      let [disx, disy] = [e.pageX - el.offsetLeft, e.pageY - el.offsetTop]
      document.onmousemove = e => {
        let [x, y, maxX, maxY] = [e.pageX - disx, e.pageY - disy, document.body.clientWidth - parseInt(window.getComputedStyle(el).width), document.body.clientHeight - parseInt(window.getComputedStyle(el).height)]
        // 边界处理
        if (x < 0) {
          x = 0
        } else if (x > maxX) {
          x = maxX
        }
        if (y < 0) {
          y = 0
        } else if (y > maxY) {
          y = maxY
        }
        el.style.left = x + 'px'
        el.style.top = y + 'px'
      }
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null
      }
    }
  }
}

export default {
  install (Vue) {
    Vue.directive('debounce', debounce)
    Vue.directive('throttle', throttle)
    Vue.directive('draggable', draggable)
  }
}
