<template>
  <div class="row justify-content-center mt-3" style="height: 80vh">
    <div class="card w-50 h-100 mb-4">
      <loading
        v-model:active="isLoading"
        :can-cancel="false"
        :is-full-page="true"
        :loader="'dots'"
      />

      <div class="card-body h-100">
        <div class="mb-2 h-25">
          <label for="newChannelName">chat with</label>
          <input
            v-model="chatWith"
            name="chatWith"
            type="text"
            class="form-control"
            v-bind:class="{ 'is-invalid': errors.targetUserId }"
          />
          <div
            class="invalid-feedback"
            v-for="error in errors.targetUserId"
            v-bind:key="error"
          >
            {{ error }}
          </div>
          <div v-if="errorMsg" class="alert alert-danger" role="alert">
            {{ errorMsg }}
          </div>
          <button
            class="btn btn-success"
            v-on:click="createPrivateChannel(chatWith)"
            v-bind:disabled="isLoading"
          >
            create
          </button>
        </div>

        <div class="row h-75">
          <!-- channel info-->
          <ul class="col-6 mh-100 list-group list-group-flush overflow-auto">
            <template v-for="channel in channelList" v-bind:key="channel.id">
              <template
                v-for="member in channel.members"
                v-bind:key="member.id"
              >
                <div class="card" v-if="member.id != myUserId">
                  <div v-on:click="selectChannel(channel)" class="card-body">
                    <div class="row">
                      <p class="col-6 fs-6 text-start fw-bold">
                        {{ member.username }}
                      </p>
                      <p class="col-6 text-end">
                        {{ channel.updateAt.format("lll") }}
                      </p>
                    </div>
                  </div>
                </div>
              </template>
            </template>
          </ul>
          <!-- chat -->
          <div v-if="selectedChannel.id" class="h-100 col-6">
            <PrivateChat
              :channel="selectedChannel"
              :messagList="messagList"
            ></PrivateChat>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../../../store/index";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import PrivateChat from "./PrivateChat.vue";
import moment from "moment";

export default {
  name: "PrivateChannel",
  components: {
    Loading,
    PrivateChat,
  },
  created() {
    this.getPrivateChannelList();
  },
  data() {
    return {
      channels: [],
      eventSource: {},
      lastConnect: moment().utc().format("YYYY-MM-DDTHH:mm:ssZ"),
      messages: new Map(),
      chatWith: "",
      selectedChannel: {},
      isLoading: false,
      errors: {},
      errorMsg: "",
    };
  },
  methods: {
    getPrivateChannelList() {
      this.isLoading = true;
      store
        .dispatch("chat/getPrivateChannelList")
        .then((channelList) => {
          for (let channel of channelList.channels) {
            channel.updateAt = moment(new Date(channel.updateAt));
            if (!this.messages.get(channel.id))
              this.messages.set(channel.id, new Map());
          }
          this.channels = channelList.channels;
          this.getAllMessages();
          this.subscribe();
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    createPrivateChannel(chatWith) {
      store
        .dispatch("chat/createPrivateChannel", { chatWith: chatWith })
        .then(() => {
          this.getPrivateChannelList();
        })
        .catch((error) => {
          if (error.errors) this.errors = error.errors;
          else this.errors = {};

          if (error.message) {
            this.errorMsg = error.message;
          } else {
            this.errorMsg = "";
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    selectChannel(channel) {
      this.selectedChannel = channel;
    },
    clearselectChannel() {
      this.selectedChannel = {};
    },
    getAllMessages() {
      this.isLoading = true;
      store
        .dispatch("chat/getPrivateChannelMessagesOfUser")
        .then((msgs) => {
          this.onMessages(msgs);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    refreshMessages(from = null) {
      let since =
        from ||
        moment().utc().subtract(240, "seconds").format("YYYY-MM-DDTHH:mm:ssZ");
      store
        .dispatch("chat/getPrivateChannelMessagesOfUserSince", {
          since: since,
        })
        .then((msgs) => {
          this.onMessages(msgs);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onMessages(msgs) {
      for (let msg of msgs) {
        msg.createAt = moment(new Date(msg.createAt));
        msg.updateAt = moment(new Date(msg.updateAt));

        if (!this.messages.get(msg.channel))
          this.messages.set(msg.channel, new Map());
        let msgsOfChannel = this.messages.get(msg.channel);
        let old = msgsOfChannel.get(msg.id);
        if (!old || (old && old.version < msg.version)) {
          msgsOfChannel.set(msg.id, msg);
        }
        let channel = this.channels.find((ch) => ch.id == msg.channel);
        //if channel==null, fetch channel info from server
        if (channel && channel.updateAt < msg.updateAt) {
          channel.updateAt = msg.updateAt;
        }
      }
    },
    subscribe() {
      store
        .dispatch("chat/subscibeToPrivateChannel", {
          lastConnect: this.lastConnect,
        })
        .then((eventSource) => {
          this.eventSource = eventSource;
          this.eventSource.onopen = () => {
            this.refreshMessages(this.lastConnect);
            this.lastConnect = moment().utc().format("YYYY-MM-DDTHH:mm:ssZ");
          };
          this.eventSource.onmessage = (e) => {
            let res = JSON.parse(e.data);
            this.onMessages(Array.isArray(res) ? res : [res]);
          };
          this.eventSource.onerror = () => {
            this.eventSource.close();
            this.subscribe();
          };
        });
    },
  },
  computed: {
    channelList() {
      return [...this.channels].sort((a, b) => b.updateAt - a.updateAt);
    },
    messagList() {
      return [...this.messages.get(this.selectedChannel.id).values()].sort(
        (a, b) => a.createAt - b.createAt
      );
    },
    myUserId() {
      return store.state.auth.user.id;
    },
  },
  beforeUnmount() {
    this.eventSource.close();
  },
};
</script>

<style>
</style>