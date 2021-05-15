<template>
  <CFlex align="center" justify-content="center">
    <CGrid columns="repeat(9, 1fr)">
      <video
        v-for="(stream, i) in streams"
        :key="i"
        id="vid2"
        autoplay
        playsinline
        :srcObject.prop="stream"
        h="100%"
        v-chakra
      ></video>
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
  streams: MediaStream[] = [];

  async mounted(): Promise<void> {
    console.log(this.peerArray);

    this.peer = new Peer(store.state.user.peerId);
    this.peer.on("open", () => {
      console.log("Opened, your ID is: " + this.peer.id);
    });

    this.peer.on("connection", (conn) => {
      console.log("conn", conn);
      this.connection = conn;
      conn.on("data", (data) => {
        console.log("ddd", data);
      });
    });
    this.peer.on("call", async (call) => {
      call.answer(
        await navigator.mediaDevices.getUserMedia({ audio: false, video: true })
      );
      call.on("stream", (stream) => {
        this.streams.push(stream);
      });
    });
    for (const peer of this.peerArray) {
      await this.call(peer.id as string);
    }
  }

  async call(id: string): Promise<void> {
    if (id == store.state.user.peerId) return;
    console.log("Calling", id);

    const call = this.peer.call(
      id,
      await navigator.mediaDevices.getUserMedia({ audio: false, video: true })
    );
    console.log(call);
    
    call.on("stream", (stream) => {
      this.streams.push(stream);
    });
  }
}
</script>

<style scoped></style>
