import Vue from 'vue'
import App from './App.vue'
import axios from "axios"
Vue.prototype.$http = axios
Vue.config.productionTip = false
// 请求拦截器，增加API身份验证
axios.interceptors.request.use(config => {
  config.headers.Authorization = 'APPCODE 641ea7e82b504370a7bb242371d79346'
  return config
})
new Vue({
  render: h => h(App),
}).$mount('#app')
