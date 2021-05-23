<template>
  <CFlex align="center" justify-content="center">
    <CSimpleGrid
      :columns="
        mobile
          ? Math.ceil(Math.sqrt(streams.length * 0.35) / myzoom)
          : Math.ceil(Math.sqrt(streams.length * 1.0))
      "
      :gap="'20px'"
      v-if="streams.length > 1"
    >
      <video
        v-for="(stream, i) in streams"
        :key="i"
        id="vid2"
        :width="100 / (mobile
          ? Math.floor(Math.sqrt(streams.length * 0.35) / myzoom)
          : Math.floor(Math.sqrt(streams.length * 1.0))) + 'vw'"
        autoplay
        playsinline
        :srcObject.prop="stream"
        v-chakra
      ></video>
    </CSimpleGrid>

     <video
        autoplay
        playsinline
        width="100vw"
        :srcObject.prop="streams[0]"
        v-else
        v-chakra
      ></video>
  </CFlex>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
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
  count = 5;
  myzoom = 1;
  @Prop({ required: true, default: 1 }) readonly zoom: number = 1;
  @Prop({ required: false, default: false }) readonly mobile?: boolean;

  @Watch("zoom") watcher(value: number) {
    this.myzoom = value;
  }
  async mounted(): Promise<void> {
   
    console.log("Peerz", this.peerArray);

    this.peer = new Peer(
      store.state.user.peerId , {host: 'localhost', port: 3001, path: '/peerBroker'}
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
      if (!this.lStream) {
        this.lStream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        });
        store.commit("setStreamId", this.lStream.id);
      }

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
    if (!this.lStream) {
      this.lStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
      store.commit("setStreamId", this.lStream.id);
    }

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
