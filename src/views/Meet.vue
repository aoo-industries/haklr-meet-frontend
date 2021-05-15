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
        gap="3rem"
        z-index="900"
      >
        <CHeading color="gray">
          Haklr Meet 
        </CHeading>
        <CText as="span" size="lg"> {{ id }} </CText>
      </CFlex>

      <CFlex
        background="#F9F9F9"
        align="center"
        grid-column-start="1"
        justify-content="center"
        z-index="300"
      >
        <Video h="100%" v-chakra />
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
import store from "../store";
import Chat from "../components/Chat.vue";
import Control from "../components/Control.vue";
import Video from "../components/Video.vue";

@Component({
  components: {
    Chat,
    Control,
    Video,
  },
})
export default class Home extends Vue {
  mounted(): void {
    if (!store.state.user.loggedIn) this.$router.push('/')
  }

  get id() {
    return store.state.user.roomId
  }
}
</script>
