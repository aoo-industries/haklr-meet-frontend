<template>
  <CBox :p="[5, 12, 20, 32]">
    <CFlex direction="column" gap="1rem" max-w="30rem" justify-content="center">
      <CHeading>
        Hi.
      </CHeading>
      <CText>
        Welcome to Haklr Meet
      </CText>
      <CFlex direction="column" mt="8">
        <CText font-size="2xl">Your ID</CText>
        <CFlex gap="1rem">
          <CHeading size="xl">{{ $route.params.id }}</CHeading>
          <CButton v-clipboard="() => $route.params.id">
            Copy
          </CButton>
        </CFlex>
      </CFlex>
      <CFlex direction="column" mt="8" gap="1rem">
        <CText font-size="2xl">Nickname</CText>
        <CInput placeholder="Enter your name" v-model="nick" />
      </CFlex>
      <CButton :disabled="processing" mt="20" @click="onJoin">
        Join
      </CButton>
    </CFlex>
  </CBox>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import store from "../store";
import { User } from  '../types'

import { io } from "socket.io-client";

@Component
export default class Hello extends Vue {
  public nick = "";
  public processing = false;
  
  mounted(): void {
    if (!this.$route.params.id) this.$router.push("/");
  }

  public onJoin(): void {
    if (!this.verify()) return;
    this.processing = true;
    const socket = io(process.env.VUE_APP_BE_ADDRESS || "", {
      auth: {
        nickname: this.nick,
        auth: "Seru ti na auth",
        roomId: this.$route.params.id,
      },
    });
    socket.on("roomConnectConfirm", (id: string, userArray: User[]) => {
      store.state.user.roomId = this.$route.params.id;
      store.state.user.nickname = this.nick;
      store.state.user.peerId = id;
      store.state.userArray = userArray;
      this.$router.push('Meet')
    });
    socket.on("connect_error", (err) => {
      throw err;
    });
  }

  private verify(): boolean {
    if (!this.nick || this.nick.length < 4)
      return (
        this.$toast({
          title: "No nick",
          description:
            "Haklr Meet requires a nickname longer than 3 characters to join the room",
          status: "error",
        }),
        false
      );
    return true;
  }
}
</script>

<style scoped></style>
