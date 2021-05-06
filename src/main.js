// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI, { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import less from 'less'
import axios from 'axios'
// 导入全局样式表
import './assets/css/global.css'


axios.defaults.baseURL='http://www.ysqorz.top:8888/api/private/v1/'

axios.interceptors.request.use(config => {
  console.log(config)
  //在最后必须return
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config
})


Vue.prototype.$http = axios
//使用弹窗
Vue.prototype.$message = Message

Vue.use(less)
Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
