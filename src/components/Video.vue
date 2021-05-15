<template>
  <CFlex align="center" justify-content="center">
    <video
      id="vid2"
      :style="playing ? undefined : 'display: none'"
      autoplay
      playsinline
      h="100%"
      v-chakra
    ></video>
    <CFlex v-if="!playing" direction="column" gap="1rem" max-w="30rem">
      <CHeading>
        Hi.
      </CHeading>
      <CText>
        This is your Meet room. There is currently no video transferring. Let's
        start a call!
      </CText>
      <CFlex gap="1rem">
        <CInput placeholder="Enter the ID" v-model="callID" />
        <CButton @click="call(undefined)">
          Call
        </CButton>
      </CFlex>
      <CFlex direction="column" mt="8">
        <CText font-size="2xl">Your ID</CText>
        <CFlex gap="1rem">
          <CHeading size="xl">{{ myID }}</CHeading>
          <CButton v-clipboard="() => myID" v-clipboard:success="copied">
            Copy
          </CButton>
        </CFlex>
      </CFlex>
    </CFlex>
  </CFlex>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Peer, { DataConnection } from "peerjs";

@Component
export default class Video extends Vue {
  connection!: DataConnection;
  peer!: Peer;
  vid2!: HTMLMediaElement;
  myID = "";
  callID = "";
  playing = false;

  mounted() {
    const vid1 = document.getElementById("vid1");
    this.vid2 = document.getElementById("vid2") as HTMLMediaElement;

    this.peer = new Peer(
      "" +
        Math.floor(Math.random() * 3 ** 10)
          .toString(36)
          .substring(0, 3)
    );
    this.myID = this.peer.id;
    this.peer.on("open", () => {
      console.log("Your ID is: " + this.peer.id);
    });

    this.peer.on("connection", (conn) => {
      console.log(conn);
      this.connection = conn;
      conn.on("data", (data) => {
        console.log(data);
      });
    });
    this.peer.on("call", async (call) => {
      call.answer(
        await navigator.mediaDevices.getUserMedia({ audio: false, video: true })
      );
      call.on("stream", (stream) => {
        this.playing = true;
        this.vid2.srcObject = stream;
      });
    });
  }
  connect(id: string) {
    this.connection = this.peer.connect(id);
  }
  async call(id: string = this.callID) {
    console.log(id);

    const call = this.peer.call(
      id,
      await navigator.mediaDevices.getUserMedia({ audio: false, video: true })
    );

    call.on("stream", (stream) => {
      this.playing = true;
      this.vid2.srcObject = stream;
    });
  }
  copied() {
    this.myID = "copied";
    setTimeout(() => {
      this.myID = this.peer.id;
    }, 1000);
  }
}
</script>

<style scoped></style>
