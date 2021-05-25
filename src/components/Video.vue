<template>
  <CFlex
    align="center"
    justify-content="space-around"
    height="mobile"
    ref="grid"
  >
    <video
      autoplay
      playsinline
      :height="mobile ? 'auto' : videoHeight"
      :width="mobile ? '100vw' : 'auto'"
      :srcObject.prop="streams[primaryStream || 0]"
      v-if="(streams.length === 1 || primaryStream)"
      v-chakra
    ></video>
    <CSimpleGrid
      :columns="
        mobile
          ? Math.ceil(Math.sqrt(streams.length * 0.35) / myzoom)
          : Math.ceil(Math.sqrt(streams.length * 1.0))
      "
      :gap="'2px'"
      :height="mobile ? 'auto' : videoHeight"
      v-else
    >
      <video
        v-for="(stream, i) in streams"
        :key="i"
        id="vid2"
        :width="
          100 / (true ? '1' : Math.floor(Math.sqrt(streams.length * 1.0))) +
            'vw'
        "
        :height="videoHeight / Math.floor(Math.sqrt(streams.length * 1.0))"
        autoplay
        playsinline
        :srcObject.prop="stream"
        v-chakra
      ></video>
    </CSimpleGrid>
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
  videoHeight = 3;
  lastResize = Date.now();
  tryCount = 0;
  primaryStream = 0;

  @Prop({ required: true, default: 1 }) readonly zoom: number = 1;
  @Prop({ required: false, default: false }) readonly mobile?: boolean;

  @Watch("zoom") watcher(value: number) {
    this.myzoom = value;
  }

  getWidth() {
    return "1500";
  }
  async mounted(): Promise<void> {
    console.log("Peerz", this.peerArray);
    window.onresize = (ev: Event) => {
      const numero = ++this.tryCount;
      this.videoHeight = (this.$refs.grid as any).$el.clientHeight / 1.25;

      setTimeout(() => {
        if (numero != this.tryCount) return;
        this.videoHeight = (this.$refs.grid as any).$el.clientHeight / 1.01;
      }, 300);
    };
    this.videoHeight = (this.$refs.grid as any).$el.clientHeight / 1.01;

    this.peer = new Peer(store.state.user.peerId, {
      host: "localhost",
      port: 3001,
      path: "/peerBroker",
    });

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
