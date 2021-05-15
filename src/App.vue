<template>
  <c-theme-provider>
    <c-reset />
    <router-view />
  </c-theme-provider>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

@Component
export default class App extends Vue {

}
</script>
