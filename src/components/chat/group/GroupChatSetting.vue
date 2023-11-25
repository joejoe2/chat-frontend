<template>
  <div class="card h-100 q-gutter-sm">
    <h6>{{ channelName }}</h6>
    <div>
      <q-dialog v-model="showAlert">
        <q-card class="bg-danger text-white">
          <q-card-section>
            <div class="text-h6">Alert</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div v-if="errorMsg">
              {{ errorMsg }}
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-btn color="green" label="Invite others" class="w-50 self-center">
        <q-menu>
          <div>
            <label for="invite">Type user ID:</label>
            <input
              v-model="invitee"
              name="invitee"
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
            <q-btn
              color="primary"
              label="Invite"
              push
              size="sm"
              v-on:click="invite"
            />
          </div>
        </q-menu>
      </q-btn>
    </div>
    <div>
      <q-btn
        color="red"
        label="Leave"
        @click="leave()"
        class="w-50 self-center"
      >
      </q-btn>
    </div>
  </div>
</template>

<script>
import store from "../../../store/index";

export default {
  name: "GroupChatSetting",
  components: {},
  computed: {
    channelName() {
      return this.channel.name;
    },
  },
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      invitee: "",
      errors: {},
      errorMsg: "",
      showAlert: false,
    };
  },
  methods: {
    invite() {
      store
        .dispatch("chat/inviteToGroupChannel", {
          channelId: this.channel.id,
          targetUserId: this.invitee,
        })
        .catch((error) => {
          if (error.errors) this.errors = error.errors;
          else this.errors = {};

          if (error.message) {
            this.errorMsg = error.message;
            this.showAlert = true;
          }
        });
    },
    leave() {
      store
        .dispatch("chat/leave", {
          channelId: this.channel.id,
        })
        .catch((error) => {
          if (error.errors) this.errors = error.errors;
          else this.errors = {};

          if (error.message) {
            this.errorMsg = error.message;
            this.showAlert = true;
          }
        });
    },
  },
};
</script>

<style scoped></style>
