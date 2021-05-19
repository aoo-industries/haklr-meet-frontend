<template>
  <CFlex align="center" justify-content="center">
    <!-- <CButton @click="abortion">
      ABOIRT
    </CButton> -->
    <!-- <CGrid :template-columns="`repeat(${Math.ceil(streams.length / 3)}, 1fr)`"> -->
    <CGrid :template-columns="`repeat(auto-fit, minmax(${size}rem, 1fr));`">
      <!-- <video
        v-for="(stream, i) in streams"
        :key="i"
        id="vid2"
        autoplay
        playsinline
        :srcObject.prop="stream"
        h="100%"
        v-chakra
      ></video> -->
    <img src="https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg" v-for="i in count" :key="i"/>
    </CGrid>




  </CFlex>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Peer, { DataConnection } from "peerjs";
import store from "../store";

@Component
export default class Video extends Vue {
  connection!: DataConnection;
  peer!: Peer;
  peerArray = store.state.userArray;
  vid2!: HTMLMediaElement;
  calls: any[] = [];
  lStream?: MediaStream;
  streams: MediaStream[] = [];
  count = 3
  sizes = [
    [2, 20], [3, 15], [5, 10]
  ]


  get size() {
    let found = this.sizes.find((s) => this.count > s[0])
    return found ? found[1] : 10
  }
  async mounted(): Promise<void> {
    window.onbeforeunload = async () => {
      this.abortion();
    };
    console.log("Peerz", this.peerArray);

    this.peer = new Peer(
      store.state.user.peerId /*, {host: 'localhost', port: 3001, path: '/peerBroker'}*/
    );

    this.peer.on("open", async () => {
      console.log("Opened, your ID is: " + this.peer.id);
      for (const peer of this.peerArray) {
        await this.call(peer.id as string);
      }
    });

    this.peer.on("connection", (conn) => {
      console.log("conn", conn);
      this.connection = conn;
      conn.on("data", (data) => {
        console.log("ddd", data);
      });
    });
    this.peer.on("call", async (call) => {
      if (!this.lStream)
        this.lStream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        });

      call.answer(this.lStream);
      this.calls.push(call);
      call.on("stream", (stream) => {
        this.streams.push(stream);
      });
    });
    this.$socket.on("peer_out", (streamId: string) => {
      console.log("Peer Out received with id", streamId);
      console.log(
        `I got the following IDs on me ${this.streams.map(
          (stream) => `${stream.id}; `
        )}`
      );

      this.streams = this.streams.filter((stream) => stream.id !== streamId);
    });
    this.$socket.on("idid", (streamId: string) => {
      this.$socket.emit("disconnect_me", this.lStream?.id);
    });
  }

  async call(id: string): Promise<void> {
    if (id == store.state.user.peerId) return;
    console.log("Calling", id);
    if (!this.lStream)
      this.lStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });

    const call = this.peer.call(id, this.lStream);

    this.calls.push(call);
    call.on("stream", (stream) => {
      this.streams.push(stream);
    });
  }

  abortion(): void {
    console.log(this.lStream);

    console.log("Disconnecting", this.lStream?.id);

    this.$socket.emit("disconnect_me", this.lStream?.id);
    this.$socket.disconnect();
  }
}
</script>

<style scoped></style>
