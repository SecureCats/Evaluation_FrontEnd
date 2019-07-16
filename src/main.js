import Vue from 'vue'
import VueConfetti from 'vue-confetti'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import VueElementLoading from 'vue-element-loading'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$http = axios

Vue.use(VueConfetti)
Vue.component('VueElementLoading', VueElementLoading)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
