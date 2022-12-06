import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/reset.css'
import './plugins/ant-design'
import './plugins/element-ui'
import { Message } from 'element-ui'
import * as filters from './utils/filters'
import Directives from './utils/directives'
import './assets/icon/iconfont.css'

// 注册全局格式化函数
Object.keys(filters.default).forEach(item => {
  Vue.filter(item, filters.default[item])
})
Vue.config.productionTip = false
Vue.config.performance = true
Vue.use(Directives)

Vue.prototype.$message = Message

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
