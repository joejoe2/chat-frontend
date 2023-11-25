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
            <div>
              {{ item.content }}
            </div>
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
            <div>
              {{ item.content }}
            </div>
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
      <q-btn color="secondary" label="...">
        <q-menu auto-close fit>
          <q-list style="min-width: 100px">
            <q-item v-if="!isBlocked" clickable v-on:click="block(true)">
              <q-item-section>block</q-item-section>
            </q-item>
            <q-item v-else clickable v-on:click="block(false)">
              <q-item-section>unblock</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
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
  mounted() {
    setTimeout(() => this.scrollToBottom(), 100);
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
      if (this.autoScrollToBottom && details.direction == "decrease") {
        this.autoScrollToBottom = false;
      } else if (!this.autoScrollToBottom && details.index == details.to) {
        this.autoScrollToBottom = true;
      }
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
    block(isBlocked = true) {
      console.log(isBlocked);
      store
        .dispatch("chat/blockPrivateChannel", {
          channelId: this.channel.id,
          isBlocked: isBlocked,
        })
        .then((res) => {
          this.channel.isBlocked = res.isBlocked;
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
    isBlocked() {
      return this.channel.isBlocked || false;
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
