<template>
  <div class="row justify-content-center mt-3" style="height: 80vh">
    <div class="card w-50 h-100 mb-4">
      <loading v-model:active="isLoading" :can-cancel="false" :is-full-page="true" :loader="'dots'" />

      <div class="card-body h-100">
        <div class="mb-2">
          <label for="newChannelName">new group chnnel:</label>
          <input v-model="newChannelname" name="newChannelname" type="text" class="form-control"
            v-bind:class="{ 'is-invalid': errors.channelName }" />
          <div class="invalid-feedback" v-for="error in errors.channelName" v-bind:key="error">
            {{ error }}
          </div>
          <div v-if="errorMsg" class="alert alert-danger" role="alert">
            {{ errorMsg }}
          </div>
          <button class="btn btn-success" v-on:click="createGroupChannel(newChannelname)" v-bind:disabled="isLoading">
            create
          </button>
        </div>
        <div class="row">
          <div class="col-6">
            <input type="checkbox" name="toggole" v-model="togglePending">
            <label for="toggole">Display invitations ?</label>
          </div>
        </div>
        <div class="row">
          <!-- channel info-->
          <ul v-if="!togglePending" class="col-6 mh-100 list-group list-group-flush overflow-auto">
            <template v-for="channel in channelList" v-bind:key="channel.id">
              <div class="card">
                <div v-on:click="selectChannel(channel)" class="card-body">
                  <div class="row">
                    <p class="col-6 fs-6 text-start fw-bold">
                      {{ channel.name }}
                    </p>
                    <p class="col-6 text-end">
                      {{ channel.updateAt.format("lll") }}
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </ul>
          <ul v-else class="col-6 mh-100 list-group list-group-flush overflow-auto">
            <template v-for="invitaiton in pendingChannelList" v-bind:key="invitaiton.id">
              <div class="card">
                <div class="card-body">
                  <div class="row">
                    <p class="col-6 fs-6 text-start fw-bold">
                      {{ invitaiton.from.username + ' invite you to join his/her channel !' }}
                    </p>
                    <button class="btn btn-success" v-on:click="acceptInvitaiton(invitaiton.channel)">
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </ul>
          <!-- chat -->
          <div v-if="selectedChannel.id" class="h-100 col-6">
            <q-tabs v-model="panel" dense class="text-grey" active-color="primary" indicator-color="primary"
              align="justify" narrow-indicator>
              <q-tab name="chat" label="Chat" />
              <q-tab name="setting" label="Setting" />
              <q-tab name="members" label="Members" />
            </q-tabs>
            <q-separator/>
            <q-tab-panels v-model="panel" animated>
              <q-tab-panel name="chat">
                <GroupChat :channel="selectedChannel" :messagList="messagList"></GroupChat>
              </q-tab-panel>
              <q-tab-panel name="setting">
                <GroupChatSetting :channel=selectedChannel>
                </GroupChatSetting>
              </q-tab-panel>
              <q-tab-panel name="members">
                <GroupMemberSetting :channel=selectedChannel>
                </GroupMemberSetting>
              </q-tab-panel>
            </q-tab-panels>
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
import GroupChat from "./GroupChat.vue";
import GroupChatSetting from './GroupChatSetting.vue';
import GroupMemberSetting from './GroupMemberSetting.vue';
import moment from "moment";

export default {
  name: "GroupChannel",
  components: {
    Loading,
    GroupChat,
    GroupChatSetting,
    GroupMemberSetting,
  },
  created() {
    this.getGroupChannelList(moment(0).utc().format("YYYY-MM-DDTHH:mm:ssZ"));
    this.subscribe();
  },
  data() {
    return {
      channels: new Map(),
      pendingChannels: new Map(),
      togglePending: false,
      eventSource: {},
      lastConnect: moment().utc().format("YYYY-MM-DDTHH:mm:ssZ"),
      messages: new Map(),
      newChannelname: "",
      selectedChannel: {},
      isLoading: false,
      errors: {},
      errorMsg: "",
      pageSize: 10,
      panel: 'chat',
    };
  },
  methods: {
    createGroupChannel(channelName) {
      store
        .dispatch("chat/createGroupChannel", { channelName: channelName })
        .then(() => {
          this.getGroupChannelList(moment().utc().subtract(30, "seconds").format("YYYY-MM-DDTHH:mm:ssZ"));
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
    getGroupChannelList(since, page = 0) {
      this.isLoading = true;
      store
        .dispatch("chat/getGroupChannelListSince", {
          since: since,
          page: page,
          size: this.pageSize,
        })
        .then((res) => {
          for (let channel of res.channels) {
            channel.updateAt = moment(new Date(channel.updateAt));
            if (!this.messages.get(channel.id))
              this.messages.set(channel.id, new Map());
            this.channels.set(channel.id, channel);
          }
          if (res.hasNext) this.getGroupChannelList(since, page + 1);
          else {
            this.getAllMessages(since);
            this.isLoading = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.isLoading = false;
        });
    },
    getAllMessages(since) {
      for (let channelId of this.channels.keys()) {
        this.getMessagesSince(channelId, since, 0);
      }
      this.getInvitations(since);
    },
    getMessagesSince(channelId, since, page = 0) {
      store
        .dispatch("chat/getGroupChannelMessagesSince", {
          channelId: channelId,
          since: since,
          page: page,
          size: this.pageSize,
        })
        .then((res) => {
          this.onMessages(res.messages);
          if (res.hasNext) this.getMessagesSince(channelId, since, page + 1);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onMessages(msgs) {
      for (let msg of msgs) {
        try {
          msg.content = JSON.parse(msg.content);
          console.log(msg);
        } catch (error) {
          
        }
        msg.createAt = moment(new Date(msg.createAt));
        msg.updateAt = moment(new Date(msg.updateAt));
        //if not in chnnel list
        if (!this.messages.get(msg.channel))
          this.messages.set(msg.channel, new Map());
        //replace old msg if newer version of same msg
        let msgsOfChannel = this.messages.get(msg.channel);
        let old = msgsOfChannel.get(msg.id);
        if (!old || (old && old.version < msg.version)) {
          msgsOfChannel.set(msg.id, msg);
        }

        if (msg.messageType == 'INVITATION') {
          this.pendingChannels.set(msg.channel, msg);
          continue;
        }
        let channel = this.channels.get(msg.channel);
        //if channel==null, need to fetch channel info from server
        //update channel info
        if (!channel) {
          store
            .dispatch("chat/getGroupChannelProfile", {
              channelId: msg.channel,
            })
            .then((channel) => {
              channel.updateAt = moment(new Date(channel.updateAt));
              this.channels.set(channel.id, channel);
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (channel.updateAt < msg.updateAt) {
          channel.updateAt = msg.updateAt;
        }
      }
    },
    subscribe() {
      store
        .dispatch("chat/subscibeToGroupChannel")
        .then((eventSource) => {
          this.eventSource = eventSource;
          this.eventSource.onopen = () => {
            this.getAllMessages(this.lastConnect);
            this.lastConnect = moment().utc().format("YYYY-MM-DDTHH:mm:ssZ");
          };
          this.eventSource.onmessage = (e) => {
            let res = JSON.parse(e.data);
            this.onMessages(Array.isArray(res) ? res : [res]);
          };
          this.eventSource.onerror = this.eventSource.onclose = () => {
            this.getAllMessages(this.lastConnect);
            if (this.eventSource) {
              setTimeout(() => this.subscribe(), 2000);
              this.eventSource.close();
            }
          };
        });
    },
    getInvitations(since, page = 0) {
      store
        .dispatch("chat/getInvitations", {
          since: since,
          page: page,
          size: this.pageSize,
        })
        .then((res) => {
          this.onMessages(res.messages);
          if (res.hasNext) this.getInvitations(since, page + 1);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    acceptInvitaiton(channelId) {
      store
        .dispatch("chat/acceptInvitationToGroupChannel", {
          channelId: channelId,
        })
        .then((res) => {
          this.pendingChannels.set(channelId, null);
          this.getMessagesSince(channelId, moment(0).utc().format("YYYY-MM-DDTHH:mm:ssZ"), 0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  computed: {
    channelList() {
      return [...this.channels.values()].sort(
        (a, b) => b.updateAt - a.updateAt
      );
    },
    pendingChannelList() {
      let res = [];
      for (let k of this.pendingChannels.keys()) {
        if (this.channels.get(k) == null) res.push(this.pendingChannels.get(k));
      }
      return res.sort(
        (a, b) => b.updateAt - a.updateAt
      );
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
    this.eventSource = null;
  },
};
</script>

<style></style>