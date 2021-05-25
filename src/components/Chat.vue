<template>
  <CFlex direction="column" h="100vh" justify-content="space-between">
  <CFlex>
    <MessageSquareIcon m="3" size="3x" v-chakra  />
    <CHeading size="lg" mt="5"> Chat </CHeading>
  </CFlex>
    <CCloseButton @click="$emit('switchMessages')" v-if="mobile" position="absolute" top="20px" right="15px" background="white" />
    <CBox overflow="auto" h="100%" mx="3" ref="messageBox">
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
    </CBox>

    <CFlex p="3" pb="0" position="relative" w="100%" bottom="20px" gap="0.5rem">
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

import { MessageSquareIcon } from 'vue-feather-icons'

@Component({
  components: {
    MessageSquareIcon
  },
  props: {
    mobile: {
      type: Boolean,
      default: false,
    },
  },
})
export default class Chat extends Vue {
  private messages: Message[] = [
    {
      username: "Interviewer",
      text: "Hello!",
      time: Date.now(),
      userId: "999",
    },
      {
      username: "Interviewer",
      text: "Welcome to our interview",
      time: Date.now(),
      userId: "999",
    },
      {
      username: "Interviewer",
      text: "Note that this chat is recorded",
      time: Date.now(),
      userId: "999",
    },
     
  ];

  public current = "";

  mounted(): void {
    this.$socket.on("chat_message", (message) => {
      this.messages.push(message);
      (this.$refs.messageBox as any).scrollTop = (this.$refs.messageBox as any).scrollHeight
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
