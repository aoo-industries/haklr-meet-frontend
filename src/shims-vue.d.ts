declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

import Vue from "vue";

import { Socket } from "socket.io-client";

import EventEmitter from "events";

declare module "vue/types/vue" {
  interface Vue {
    $event: EventEmitter;
    $socket: Socket;
    $toast(options: {
      title?: string;
      description?: string;
      status?: "info" | "warning" | "error" | "success" | undefined;
      duration?: number | undefined;
    }): void;
  }
}
