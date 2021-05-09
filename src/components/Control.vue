<template>
  <div>
    <CFlex gap="1rem">
      <CButton @click="state.open.microphone = !state.open.microphone">{{ state.open.microphone ? "Not Speak" : "Tell a story"}}</CButton>
      <CButton @click="state.open.camera = !state.open.camera">{{ state.open.camera ? "Step into the shadows" : "Let the world see your glory"}}</CButton>
      <CButton @click="exit">Quit this shit already</CButton>
    </CFlex>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Controlpanel extends Vue {
    private state = {
        open: {
            microphone: true,
            camera: false
        }
    }

    exit() {
        window.location.href = "http://google.com"
    }
}
</script>

<style scoped></style>
