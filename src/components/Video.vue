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
      @click="minimize"
      v-if="primaryStream || primaryStream === 0 || streams.length === 1"
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
      <div
        v-for="(stream, i) in streams"
        position="relative"
        :height="
          mobile
            ? 'auto'
            : videoHeight /
              Math.ceil(
                streams.length / Math.ceil(Math.sqrt(streams.length * 1.0))
              )
        "
        :key="i"
        @click="maximize(i)"
        v-chakra
      >
        <CFlex
          position="absolute"
          bottom="0"
          top="0"
          left="3"
          align="center"
          v-chakra
        >
          <div @click="maximize(i)">
            <external-link-icon />
          </div>
        </CFlex>
        <video
          id="vid2"
          :height="
            mobile
              ? 'auto'
              : videoHeight /
                Math.ceil(
                  streams.length / Math.ceil(Math.sqrt(streams.length * 1.0))
                )
          "
          autoplay
          playsinline
          :srcObject.prop="stream"
          v-chakra
        ></video>
      </div>
    </CSimpleGrid>
  </CFlex>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Peer, { DataConnection } from "peerjs";
import { ExternalLinkIcon } from "vue-feather-icons";
import store from "../store";

@Component({
  components: {
    ExternalLinkIcon,
  },
})
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
  primaryStream: number | null = null;
  screensharePeer?: Peer;
  screenshareStream?: MediaStream;

  @Prop({ required: true, default: 1 }) readonly zoom: number = 1;
  @Prop({ required: false, default: false }) readonly mobile?: boolean;

  @Watch("zoom") watcher(value: number) {
    this.myzoom = value;
  }
  @Watch("screenShareState") handleScreenShare(value: boolean) {
    if (value) {
      console.log("Opening ss");

      this.screensharePeer = new Peer(
        `${store.state.user.peerId}-screenshare`,
        {
          host: "localhost",
          port: 3001,
          path: "/peerBroker",
        }
      );
      this.screensharePeer.on("call", async (call) => {
        let captureStream = null;

        try {
          captureStream = await (navigator.mediaDevices as any).getDisplayMedia();
        } catch (err) {
          console.error("Error: " + err);
        }
        console.log("answering", captureStream);
        this.screenshareStream = captureStream;
        call.answer(this.screenshareStream);
        this.calls.push(call);
        this.$socket.emit("set_stream_id", this.screenshareStream?.id)
      });
      this.$socket.emit("screenshare_connect");
    } else {
      console.log("Would close ss");
      this.$socket.emit("")
    }
  }
  get screenShareState() {
    return store.state.screenshareActive;
  }
  maximize(i: number) {
    console.log(i, this.primaryStream);

    this.primaryStream = i;
  }
  minimize() {
    this.primaryStream = null;
  }

  getWidth() {
    return "1500";
  }
  async mounted(): Promise<void> {
    console.log("Peerz", this.peerArray);
    setInterval(() => {
      if (!this.$refs.grid) return;
      this.videoHeight = (this.$refs.grid as any).$el.clientHeight / 1.01;
    }, 900);
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
        console.log("new data", data);
      });
    });
    this.peer.on("call", async (call) => {
      if (!this.lStream) {
        this.lStream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        });
        store.commit("setStreamId", this.lStream.id);
        this.$socket.emit("add_stream_id", this.lStream.id);

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

    this.$socket.on("screenshare_connect", async (id) => {
      await this.call(`${id}-screenshare`);
      this.primaryStream = this.streams.length
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
      this.$socket.emit("add_stream_id", this.lStream.id)

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
