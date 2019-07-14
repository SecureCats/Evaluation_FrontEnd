import Vue from 'vue'
import VueConfetti from 'vue-confetti'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

Vue.use(VueConfetti)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
