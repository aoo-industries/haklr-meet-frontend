<template>
  <CFlex direction="column" justify-content="space-between">
    <div>
      <div v-for="(message, i) in messages" :key="i" mb="5" v-chakra>
        <b> {{ message.username }} </b>
        {{
          new Date(message.time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        }}
        <br />
        {{ message.text }}
      </div>
    </div>

    <CFlex position="relative" w="100%" bottom="20px" gap="0.5rem">
      <CInput v-model="current" placeholder="Enter" />
      <CButton @click="send">
        Send
      </CButton>
    </CFlex>
  </CFlex>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import store from "../store";

@Component
export default class Chat extends Vue {
  private messages: Message[] = [
    {
      username: "Interviewer",
      text: "Welcome!",
      time: Date.now(),
      userId: "999",
    },
  ];

  public current = "";

  mounted(): void {
    this.$socket.on("chat_message", (message) => {
      this.messages.push(message);
    });
  }

  send(): void {
    this.$socket.emit("chat_message", this.current);
    this.current = "";
  }
}

interface Message {
  username: string;
  text: string;
  time: number;
  userId: string;
}
</script>

<style scoped></style>
