<template>
  <div>
    <div v-for="(message, i) in messages" :key="i" mb="5" v-chakra>
      <b> {{ message.author }} </b>
      {{
        message.date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      }}
      <br />
      {{ message.content }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Chat extends Vue {
  private messages: Message[] = [
    {
      author: "Interviewer",
      content: "Welcome!",
      date: new Date(),
    },
    {
      author: "Interviewer",
      content: "is your mic functional as of now?",
      date: new Date(),
    },
    {
      author: "galook",
      content:
        "I am afraid it is not, let me please fix it quickly, I will be back in a short moment, no worries",
      date: new Date(),
    },
  ];
}

type Message = {
  author: string;
  content: string;
  date: Date | number;
  isFile?: boolean;
};
</script>

<style scoped></style>
