<template>
  <div>
    <CFlex gap="1rem">
      <CButton @click="state.open.microphone = !state.open.microphone">
        <MicIcon v-if="state.open.microphone" />
        <MicOffIcon v-else />
      </CButton>
      <CButton @click="state.open.camera = !state.open.camera">
        <CameraIcon v-if="state.open.camera" />
        <CameraOffIcon v-else />
      </CButton>
    </CFlex>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { MicIcon, MicOffIcon, CameraIcon, CameraOffIcon } from "vue-feather-icons";

@Component({
  components: {
    MicIcon,
    MicOffIcon,
    CameraIcon, CameraOffIcon
  },
})
export default class Controlpanel extends Vue {
  private state = {
    open: {
      microphone: true,
      camera: false,
    },
  };

  exit(): void {
    window.sessionStorage.clear();
    window.location.href = "/";
  }
}
</script>

<style scoped></style>
