import Vue from 'vue'
import Vuex from 'vuex'
import {User} from '../types/'

import createPersistedState from 'vuex-persistedstate'



Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      nickname: '',
      roomId: '',
      peerId: '',
      loggedIn: false
    } as User,
    userArray: [] as User[],
  },
  mutations: {
    setUser(state, user: User) {
      user.loggedIn = true
      state.user = user
      
    },
    setUserArray(state, userArray: User[]) {
      state.userArray = userArray
    }
  },
  actions: {
  },
  modules: {
  },

  plugins: [createPersistedState({
    storage: window.sessionStorage
  })],
})
