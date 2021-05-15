<template>
  <CBox :p="[5, 12, 20, 32]">
    <CFlex direction="column" gap="1rem" max-w="30rem" justify-content="center">
      <CHeading>
        Hi.
      </CHeading>
      <CText>
        Welcome to Haklr Meet
      </CText>

      <CFlex direction="column" mt="8">
        <CText font-size="2xl">Your ID</CText>
        <CFlex gap="1rem">
          <CHeading size="xl">{{ $route.params.id }}</CHeading>
          <CButton v-clipboard="() => $route.params.id">
            Copy
          </CButton> 

        </CFlex>
      </CFlex>
      <CButton mt="20">
        Join
      </CButton>
    </CFlex>
  </CBox>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";



@Component
export default class Hello extends Vue {
}
</script>

<style scoped></style>
