<template>
  <div>
    <CSlider v-if="mobile" v-model="zoomLevel">
      <CSliderTrack />
      <CSliderFilledTrack />
      <CSliderThumb />
    </CSlider>
    <CFlex gap="1rem">
      <CButton @click="state.open.microphone = !state.open.microphone">
        <MicIcon v-if="state.open.microphone" />
        <MicOffIcon v-else />
      </CButton>
      <CButton @click="state.open.camera = !state.open.camera">
        <CameraIcon v-if="state.open.camera" />
        <CameraOffIcon v-else />
      </CButton>
      <CButton v-if="mobile" @click="$emit('switchMessages')">
        <MessageSquareIcon />
      </CButton>
       <CButton @click="exit">
        <PowerIcon />
      </CButton>
    </CFlex>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import store from '../store'
import {
  MicIcon,
  MicOffIcon,
  CameraIcon,
  CameraOffIcon,
  MessageSquareIcon,
  PowerIcon
} from "vue-feather-icons";

@Component({
  components: {
    MicIcon,
    MicOffIcon,
    CameraIcon,
    CameraOffIcon,
    MessageSquareIcon,
    PowerIcon
  },
  props: {
    mobile: {
      type: Boolean,
      default: false,
    },
  },
})
export default class Controlpanel extends Vue {
  private state = {
    open: {
      microphone: true,
      camera: false,
    },
  };
  states = store.state
  mobile!: boolean
  zoomLevel = 50
  @Watch('zoomLevel') watcher(value: number) {
    this.$emit('zoom', value / 50)
  }
  mounted() {
    if(this.mobile && window.innerWidth > 500) {
      this.zoomLevel = 20
    }
  }

  exit(): void {
    console.log('exiting...', store.state.user.streamId);
    
    if(store.state.user.streamId) {
    console.log("Disconnecting", store.state.user.streamId);
    this.$socket.emit("disconnect_me", store.state.user.streamId);
    this.$socket.disconnect();
    }
    sessionStorage.clear()
    window.location.reload()
  }
}
</script>

<style scoped></style>
