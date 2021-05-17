import { io } from "socket.io-client";
import { User } from "../types"
import store from "../store"

import Vue from "vue";


const init = async (nick: string, roomId: string): Promise<any> => {
    return new Promise<any>((resolve, reject) =>{
    const socket = io(process.env.VUE_APP_BE_ADDRESS || "", {
        auth: {
          nickname: nick,
          auth: "Seru ti na auth",
          roomId: roomId
        },
      });
      socket.on("room_connect_confirm", (id: string, userArray: User[]) => {
        const user = {} as User;
        user.roomId = roomId
        user.nickname = nick;
        user.peerId = id;
        console.log(userArray);
        
        store.commit('setUser', user)
        store.commit('setUserArray', userArray)
    
        console.log(store.state);
        Vue.prototype.$socket = socket
        resolve("")
      });
      socket.on("connect_error", (err: Error) => {
        throw err;
      });
    })
}

export default {init}

