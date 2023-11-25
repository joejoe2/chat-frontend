<template>
  <div class="card" style="max-height: 50vh">
    <h6>{{ channelName }}</h6>
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
            class="col col-12 col-sm-6 col-md-4 col-lg-4"
            v-bind:name="item.from.username + ' (You)'"
            sent
            v-bind:stamp="item.createAt.format('lll')"
          >
            <template v-slot:avatar>
              <q-btn flat>
                <img
                  class="q-message-avatar q-message-avatar--sent"
                  src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                />
              </q-btn>
            </template>
            <MessageTemplate :message="item"></MessageTemplate>
          </QChatMessage>
        </div>
        <div
          v-else
          class="row justify-content-start"
          :key="item.id + item.version"
          :index="index"
        >
          <QChatMessage
            class="col col-12 col-sm-6 col-md-4 col-lg-4"
            v-bind:name="item.from.username"
            v-bind:stamp="item.createAt.format('lll')"
          >
            <template v-slot:avatar>
              <q-btn flat>
                <img
                  class="q-message-avatar q-message-avatar--received"
                  src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                />
                <q-popup-proxy>
                  <q-card>
                    <q-card-section>
                      <div class="text-h6">{{ item.from.username }}</div>
                    </q-card-section>
                    <q-card-section>
                      <button
                        v-bind:value="item.from.id"
                        onclick="navigator.clipboard.writeText(this.value)"
                      >
                        Copy ID
                      </button>
                    </q-card-section>
                  </q-card>
                </q-popup-proxy>
              </q-btn>
            </template>
            <MessageTemplate :message="item"></MessageTemplate>
          </QChatMessage>
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
import MessageTemplate from "./MessageTemplate.vue";

export default {
  name: "GroupChat",
  components: {
    QChatMessage,
    QVirtualScroll,
    MessageTemplate,
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
  mounted() {
    setTimeout(() => this.scrollToBottom(), 100);
  },
  data() {
    return {
      message: "",
      invitee: "",
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
      if (this.autoScrollToBottom && details.direction == "decrease") {
        this.autoScrollToBottom = false;
      } else if (!this.autoScrollToBottom && details.index == details.to) {
        this.autoScrollToBottom = true;
      }
    },
    sendMessage(message) {
      store
        .dispatch("chat/sendGroupChannelMessage", {
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
          }
        });
    },
  },
  computed: {
    myUserId() {
      return store.state.auth.user.id;
    },
    channelName() {
      return this.channel.name;
    },
  },
  watch: {
    channel: function () {
      this.message = "";
      this.autoScrollToBottom = true;
      this.errors = {};
      this.errorMsg = "";
      setTimeout(() => this.scrollToBottom(), 100);
    },
  },
};
</script>

<style></style>
