<template>
  <div class="card w-50 h-100 mb-4">
    <div class="card-body h-100">
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
    </div>

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
import moment from "moment";
import { QChatMessage, QVirtualScroll } from "quasar";

export default {
  name: "PublicChat",
  components: {
    QChatMessage,
    QVirtualScroll,
  },
  created() {
    this.getAllMessages();
    this.subscribe();
  },
  props: {
    channelId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      eventSource: {},
      messages: new Map(),
      pageSize: 10,
      lastConnect: moment().utc().format("YYYY-MM-DDTHH:mm:ssZ"),
      message: "",
      autoScrollToBottom: true,
      errors: {},
      errorMsg: "",
    };
  },
  methods: {
    getAllMessages(page = 0) {
      store
        .dispatch("chat/getPublicChannelMessages", {
          channelId: this.channelId,
          page: page,
          size: this.pageSize,
        })
        .then((res) => {
          this.onMessages(res.messages);
          if (res.hasNext) this.getAllMessages(page + 1);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.scrollToBottom();
        });
    },
    refreshMessages(from = null, page = 0) {
      let since =
        from ||
        moment().utc().subtract(240, "seconds").format("YYYY-MM-DDTHH:mm:ssZ");
      store
        .dispatch("chat/getPublicChannelMessagesSince", {
          channelId: this.channelId,
          since: since,
          page: page,
          size: this.pageSize,
        })
        .then((res) => {
          this.onMessages(res.messages);
          if (res.hasNext) this.refreshMessages(since, page + 1);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onMessages(msgs) {
      for (let msg of msgs) {
        msg.createAt = moment(new Date(msg.createAt));
        msg.updateAt = moment(new Date(msg.updateAt));
        let old = this.messages.get(msg.id);
        if (!old || (old && old.version < msg.version)) {
          this.messages.set(msg.id, msg);
        }
      }
    },
    sendMessage(message) {
      store
        .dispatch("chat/sendPublicChannelMessage", {
          channelId: this.channelId,
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
    scrollToBottom() {
      this.$refs.scroller.scrollTo(this.messagList.length, "start-force");
      this.autoScrollToBottom = true;
    },
    onScroll(details) {
      if (this.autoScrollToBottom && details.index < this.messagList.length)
        this.autoScrollToBottom = false;
    },
    subscribe() {
      store
        .dispatch("chat/subscibeToPublicChannel", {
          channelId: this.channelId,
        })
        .then((eventSource) => {
          this.eventSource = eventSource;
          this.eventSource.onopen = () => {
            console.log("connect to sse");
            this.refreshMessages(this.lastConnect);
            this.lastConnect = moment().utc().format("YYYY-MM-DDTHH:mm:ssZ");
          };
          this.eventSource.onmessage = (e) => {
            if (e.data) {
              let res = JSON.parse(e.data);
              this.onMessages(Array.isArray(res) ? res : [res]);
            }
          };
          this.eventSource.onerror = () => {
            this.eventSource.close();
            this.subscribe();
          };
        });
    },
  },
  computed: {
    messagList() {
      return [...this.messages.values()].sort(
        (a, b) => a.createAt - b.createAt
      );
    },
    myUserId() {
      return store.state.auth.user.id;
    },
  },
  watch: {
    channelId: function () {
      //reload
      this.messages = new Map();
      this.errors = {};
      this.errorMsg = "";
      this.getAllMessages(this.channelId);
    },
  },
  beforeUnmount() {
    this.eventSource.close();
  },
};
</script>

<style>
</style>