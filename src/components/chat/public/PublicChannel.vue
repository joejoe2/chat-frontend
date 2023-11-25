<template>
  <button
    class="btn btn-danger"
    v-on:click="clearselectChannel"
    v-if="!selectedChannelId == ''"
  >
    back
  </button>

  <div class="row justify-content-center mt-3" style="height: 65vh">
    <PublicChat
      v-if="!selectedChannelId == ''"
      :channelId="selectedChannelId"
    ></PublicChat>

    <div class="card w-100 mb-4" v-if="selectedChannelId == ''">
      <loading
        v-model:active="isLoading"
        :can-cancel="false"
        :is-full-page="true"
        :loader="'dots'"
      />

      <div class="card-body">
        <h2 class="card-title text-center">Public Channel List</h2>
        <div class="mb-2">
          <label for="newChannelName">newChannelName</label>
          <input
            v-model="newChannelName"
            name="newChannelName"
            type="text"
            class="form-control"
            v-bind:class="{ 'is-invalid': errors.channelName }"
          />
          <div
            class="invalid-feedback"
            v-for="error in errors.channelName"
            v-bind:key="error"
          >
            {{ error }}
          </div>
          <div v-if="errorMsg" class="alert alert-danger" role="alert">
            {{ errorMsg }}
          </div>
          <button
            class="btn btn-success"
            v-on:click="createPublicChannel(newChannelName)"
            v-bind:disabled="isLoading"
          >
            create
          </button>
        </div>

        <ul class="list-group list-group-flush">
          <template
            v-for="channel in channelList.channels"
            v-bind:key="channel.id"
          >
            <div class="">
              <!-- channel Name -->
              <a
                href="#"
                v-on:click="selectChannel(channel.id)"
                class="list-group-item list-group-item-action"
              >
                {{ channel.name }}
              </a>
            </div>
          </template>
          <PageNavigation
            :currentPage="channelList.currentPage"
            :totalPages="channelList.totalPages"
            v-on:onPageChanged="updateChannelList"
          ></PageNavigation>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../../../store/index";
import Loading from "vue-loading-overlay";
import PageNavigation from "../../common/PageNavigation.vue";
import PublicChat from "../public/PublicChat.vue";

export default {
  name: "PublicChannel",
  components: {
    Loading,
    PageNavigation,
    PublicChat,
  },
  created() {
    this.getPublicChannelList(0, this.channelList.pageSize);
  },
  data() {
    return {
      channelList: {
        channels: [],
        totalItems: 0,
        currentPage: 0,
        totalPages: 0,
        pageSize: 10,
      },
      selectedChannelId: "",
      isLoading: false,
      newChannelName: "",
      errors: {},
      errorMsg: "",
    };
  },
  methods: {
    getPublicChannelList(page, size) {
      this.isLoading = true;
      store
        .dispatch("chat/getPublicChannelList", { page: page, size: size })
        .then((channelList) => {
          this.channelList = channelList;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    updateChannelList(pageNum) {
      //refresh channel list
      this.getPublicChannelList(pageNum, this.channelList.pageSize);
    },
    createPublicChannel(channelName) {
      this.isLoading = true;
      store
        .dispatch("chat/craetePublicChannel", { channelName: channelName })
        .then(() => {
          //refresh channel list
          this.getPublicChannelList(0, this.channelList.pageSize);
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
    selectChannel(channelId) {
      this.selectedChannelId = channelId;
    },
    clearselectChannel() {
      this.selectedChannelId = "";
      this.getPublicChannelList(
        this.channelList.currentPage,
        this.channelList.pageSize,
      );
    },
  },
};
</script>

<style></style>
