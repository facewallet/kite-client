import Vue from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'

import { Message, Confirm } from './components'

import './assets/css/box_layout.scss'
import './assets/css/reset.scss'
import './assets/css/other.scss'
import './assets/fonts/icon.scss'

Vue.use(Antd)
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$confirm = Confirm.install
Vue.use(Message)

export function createApp(context) {
  // 创建 router 和 store 实例
  const router = createRouter()
  const store = createStore()

  // 同步路由状态(route state)到 store
  sync(store, router)

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  return {
    app,
    router,
    store
  }
}
