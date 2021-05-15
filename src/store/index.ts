import Vue from 'vue'
import Vuex from 'vuex'
import {User} from '../types/'



Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      nickname: '',
      roomId: '',
      peerId: ''
    },
    userArray: [] as User[],
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
