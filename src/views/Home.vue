<template>
  <CBox p="20">
    <CHeading>
      Haklr Meet
    </CHeading>
    No ID set
  </CBox>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "../store";

@Component
export default class Home extends Vue {
  mounted(): void {
    if (store.state.user.loggedIn) this.$router.push("meet");
    this.$router.push(`/${Math.floor(Math.random() * 8 ** 10).toString(32)}`)
  }
}
</script>

<style scoped></style>
