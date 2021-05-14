<template>
  <div class="home">
    <CGrid
      template-rows="3.7rem auto 5rem"
      template-columns="calc(100% - 20rem) 20rem"
      h="100vh"
    >
      <CFlex
        background="rgba(207, 221, 248, 0.2)"
        grid-column-start="1"
        grid-column-end="1"
        align="center"
        justify-content="center"
        box-shadow="lg"
        z-index="900"
      >
        <CHeading color="gray">
          Haklr Meet
        </CHeading>
      </CFlex>

      <CFlex
        background="#F9F9F9"
        align="center"
        grid-column-start="1"
        justify-content="center"
        z-index="300"
      >
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
           This is your Meet room. There is currently no video transferring. Let's start a call!
          </CText>
          <CFlex gap="1rem">
          <CInput placeholder="Enter the ID" v-model="callID" />
          <CButton @click="call(undefined)">
            Call
          </CButton>
          </CFlex>
        </CFlex>
      </CFlex>

      <CFlex
        background="rgba(223, 232, 250, 0.2)"
        grid-column-start="2"
        grid-row-start="1"
        grid-row-end="4"
        justify-content="center"
        z-index="950"
      >
        <Chat p="5" pt="6" v-chakra> </Chat>
      </CFlex>
      <CFlex
        grid-column-start="1"
        grid-column-end="2 "
        align="center"
        justify-content="center"
        background="rgba(223, 232, 250, 0.2)"
        z-index="900"
        box-shadow="0rem 0rem 1rem 0.3rem rgba(0,0,0,0.2)"
        gap="5px"
      >
        <Control />
      </CFlex>
    </CGrid>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Chat from "./../components/Chat.vue";
import Control from "./../components/Control.vue";
import Peer, { DataConnection } from "peerjs";
@Component({
  components: {
    Chat,
    Control,
  },
})
export default class Home extends Vue {
  connection!: DataConnection;
  peer!: Peer;
  vid2!: HTMLMediaElement;
  callID = "";
  playing = false;

  mounted() {
    const vid1 = document.getElementById("vid1");
    this.vid2 = document.getElementById("vid2") as HTMLMediaElement;

    this.peer = new Peer(
      "" + Math.floor(Math.random() * 36 ** 10).toString(36)
    );
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
}
</script>
