import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: '#3A8FCA',
    secondary: '#F5F6F8',
    info: '#FED86E',
    success: '#4EA827',
    error: '#ED5154'
  }
})
