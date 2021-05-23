<template>
  <div class="home" v-if="ready">
    <CGrid
      template-rows="3.7rem auto 5rem"
      template-columns="calc(100% - 20rem) 20rem"
      h="100vh"
      v-if="!mobile"
    >
      <CFlex
        background="rgba(207, 221, 248, 0.2)"
        grid-column-start="1"
        grid-column-end="1"
        align="center"
        justify-content="center"
        gap="3rem"
        z-index="900"
      >
        <CHeading color="gray">
          Haklr Meet
        </CHeading>
        <CText as="span" size="lg"> {{ id }} </CText>
      </CFlex>

      <CFlex
        ml="2"
        px="2"
        align="center"
        grid-column-start="1"
        justify-content="center"
        z-index="300"
        border="2px"
        borderRadius="lg"
        borderColor="gray.300"
      >
        <Video h="100%" :zoom="1" v-chakra />
      </CFlex>

      <CFlex
        background="rgba(207, 221, 248, 0.2)"
        grid-column-start="2"
        grid-row-start="1"
        grid-row-end="4"
        justify-content="center"
        z-index="950"
      >
        <Chat v-chakra> </Chat>
      </CFlex>
      <CFlex
        grid-column-start="1"
        grid-column-end="2"
        align="center"
        justify-content="center"
        background="rgba(207, 221, 248, 0.2)"
        z-index="900"
        gap="5px"
      >
        <Control @zoom="zoomChange" />
      </CFlex>
    </CGrid>

    <CGrid template-rows="auto 5rem" v-else>
      <CFlex
        background="#F9F9F9"
        align="center"
        justify-content="center"
        z-index="300"
      >
        <Video h="100%" :mobile="true" :zoom="currentZoom" v-chakra />
      </CFlex>
      <CFlex
        align="center"
        justify-content="center"
        background="rgba(223, 232, 250, 0.5)"
        z-index="900"
        position="fixed"
        bottom="0px"
        w="100vw"
        h="5rem"
        box-shadow="0rem 0rem 1rem 0.3rem rgba(0,0,0,0.5)"
        gap="5px"
      >
        <Control
          mobile
          @switchMessages="chatOverflow = !chatOverflow"
          @zoom="zoomChange"
        />
      </CFlex>
    </CGrid>
    <Chat
      background="lightgray"
      z-index="999"
      position="fixed"
      bottom="0"
      left="0"
      w="100vw"
      h="100%"
      :mobile="true"
      v-if="chatOverflow"
      @switchMessages="chatOverflow = !chatOverflow"
      v-chakra
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "../store";
import socketService from "../services/socket";
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
export default class Meet extends Vue {
  chatOverflow = false;
  ready = false;
  currentZoom = 3;

  async created(): Promise<void> {
    if (!(store.state.user.loggedIn || store.state.user.roomId))
      this.$router.push("/");

    if (!this.$socket)
      await socketService.init(
        store.state.user.nickname,
        store.state.user.roomId
      );
    console.log("ready");

    this.ready = true;
  }

  get id() {
    return store.state.user.roomId;
  }

  get mobile() {
    let check = false;
    (function(a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || (window as any).opera);
    console.log(check);

    return check;
  }

  zoomChange(zoom: number) {
    this.currentZoom = zoom;
  }
}
</script>

<style>
body {
  background: rgb(207, 221, 248, 0.2);
}
</style>
