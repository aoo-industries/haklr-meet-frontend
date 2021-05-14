import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Clipboard from 'v-clipboard'

//@ts-expect-error Not typed
import Chakra from '@chakra-ui/vue'

Vue.use(Chakra)
Vue.use(Clipboard)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
