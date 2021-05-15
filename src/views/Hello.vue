<template>
  <div>
    <CFlex direction="column" gap="1rem" max-w="30rem">
      <CHeading>
        Hi.
      </CHeading>
      <CText>
        Welcome to Haklr Meet
      </CText>

      <CFlex direction="column" mt="8">
        <CText font-size="2xl">Your ID</CText>
        <CFlex gap="1rem">
          <CHeading size="xl">{{ myID }}</CHeading>
          <CButton v-clipboard="() => myID" v-clipboard:success="copied">
            Copy
          </CButton> 
          
        </CFlex>
      </CFlex>
      <CButton mt="20">
        Join
      </CButton>
    </CFlex>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Hello extends Vue {}
</script>

<style scoped></style>
