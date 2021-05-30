import Vue from "vue";
import Vuex from "vuex";
import { User } from "../types/";
import { Socket } from "socket.io-client";

import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      nickname: "",
      roomId: "",
      peerId: "",
      streamId: "",
      loggedIn: false,
      screenshareActive: false
    } as User,
    userArray: [] as User[],
    socket: {} as Socket,
    screenshareActive: false
  },
  mutations: {
    setUser(state, user: User) {
      user.loggedIn = true;
      state.user = user;
    },
    setUserArray(state, userArray: User[]) {
      state.userArray = userArray;
    },
    setStreamId(state, streamId: string) {
      state.user.streamId = streamId
    },
    setScreenShare(state, newStatus: boolean) {
      state.screenshareActive = newStatus
    }
  },
  actions: {},
  modules: {},

  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
});
