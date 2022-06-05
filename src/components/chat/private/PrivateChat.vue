<template>
  <div class="card h-100">
    <h6>{{ chatTarget.username }}</h6>
    <q-virtual-scroll
      style="max-height: 100%; overflow-x: hidden"
      ref="scroller"
      @virtual-scroll="onScroll"
      :items="messagList"
      :virtual-scroll-slice-size="0"
    >
      <template v-slot="{ item, index }">
        <div
          v-if="item.from.id == myUserId"
          class="row justify-content-end"
          :key="item.id + item.version"
          :index="index"
        >
          <QChatMessage
            class="col-4"
            v-bind:name="item.from.username"
            :text="[item.content]"
            sent
            v-bind:stamp="item.createAt.format('lll')"
          />
        </div>
        <div
          v-else
          class="row justify-content-start"
          :key="item.id + item.version"
          :index="index"
        >
          <QChatMessage
            class="col-4"
            v-bind:name="item.from.username"
            :text="[item.content]"
            v-bind:stamp="item.createAt.format('lll')"
          />
        </div>
      </template>
    </q-virtual-scroll>

    <div class="mb-2">
      <label for="sendMessage">sendMessage</label>
      <input
        v-model="message"
        name="sendMessage"
        type="text"
        class="form-control"
        v-bind:class="{ 'is-invalid': errors.message }"
      />
      <div
        class="invalid-feedback"
        v-for="error in errors.message"
        v-bind:key="error"
      >
        {{ error }}
      </div>
      <div v-if="errorMsg" class="alert alert-danger" role="alert">
        {{ errorMsg }}
      </div>
      <button class="btn btn-success" v-on:click="sendMessage(message)">
        send
      </button>
    </div>
  </div>
</template>

<script>
import store from "../../../store/index";
import { QChatMessage, QVirtualScroll } from "quasar";

export default {
  name: "PrivateChat",
  components: {
    QChatMessage,
    QVirtualScroll,
  },
  props: {
    channel: {
      type: Object,
      required: true,
    },
    messagList: {
      type: Array,
      required: true,
    },
  },
  created(){
      
  },
  data() {
    return {
      message: "",
      autoScrollToBottom: true,
      errors: {},
      errorMsg: "",
    };
  },
  methods: {
    scrollToBottom() {
      this.$refs.scroller.scrollTo(this.messagList.length, "start-force");
      this.autoScrollToBottom = true;
    },
    onScroll(details) {
      if (this.autoScrollToBottom && details.index < this.messagList.length)
        this.autoScrollToBottom = false;
    },
    sendMessage(message) {
      store
        .dispatch("chat/sendPrivateChannelMessage", {
          channelId: this.channel.id,
          message: message,
        })
        .then(() => {
          //success
          this.scrollToBottom();
        })
        .catch((error) => {
          if (error.errors) this.errors = error.errors;
          else this.errors = {};

          if (error.message) {
            this.errorMsg = error.message;
          } else {
            this.errorMsg = "";
          }
        });
    },
  },
  computed: {
    myUserId() {
      return store.state.auth.user.id;
    },
    chatTarget() {
      return this.channel.members.find((m) => m.id != this.myUserId);
    },
  },
  watch: {
    channel: function () {
      this.message = "";
      this.autoScrollToBottom = true;
      this.errors = {};
      this.errorMsg = "";
    },
  },
};
</script>

<style>
</style>