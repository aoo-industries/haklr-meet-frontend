import { io } from "socket.io-client";
import Vue from "vue";


const socket = io(process.env.SERVER_IP || "", {
    auth: {
        nickname: "galook",
        auth: "Seru ti na auth",
        roomId: "1337"
    }
})

socket.on("connection", (data) => {
    console.log(data);
    Vue.prototype.$event.emit("socketData", data)
})