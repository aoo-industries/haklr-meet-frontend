import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

//@ts-expect-error Not typed
import Chakra from '@chakra-ui/vue'

Vue.use(Chakra)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
