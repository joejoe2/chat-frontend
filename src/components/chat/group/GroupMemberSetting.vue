<template>
    <div class="card" style="max-height: 50vh;">
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

            <q-btn-toggle v-model="panel" dense outline toggle-color="primary" :options="[
                { label: 'Members', value: 'members' },
                { label: 'Admin', value: 'administrators' },
                { label: 'Banned', value: 'banned' }
            ]" />
            <q-separator />
            <q-tab-panels v-model="panel" animated>
                <q-tab-panel name="members">
                    <div>
                        <q-item v-for="member in members">
                            <q-item-section side>
                                <q-avatar rounded>
                                    <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" />
                                </q-avatar>
                                <q-item-label>{{ member.username }}</q-item-label>
                            </q-item-section>
                            <q-item-section v-if="isAdmin && myUserId != member.id" side top>
                                <q-btn v-if="!administrators.find((v) => v.id == member.id)" @click="kickOff(member.id)"
                                    flat dense round icon="delete">
                                    <q-tooltip>Kick Off</q-tooltip>
                                </q-btn>
                                <template
                                    v-if="!administrators.find((v) => v.id == member.id) && !banned.find((v) => v.id == member.id)">
                                    <q-btn @click="editAdmin(member.id, true)" flat dense round icon="admin_panel_settings">
                                        <q-tooltip>Set as Admin</q-tooltip>
                                    </q-btn>
                                    <q-btn @click="editBanned(member.id, true)" flat dense round icon="not_interested">
                                        <q-tooltip>Ban</q-tooltip>
                                    </q-btn>
                                </template>
                            </q-item-section>
                        </q-item>
                    </div>
                </q-tab-panel>
                <q-tab-panel name="administrators">
                    <div>
                        <q-item v-for="admin in administrators">
                            <q-item-section side>
                                <q-avatar rounded>
                                    <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" />
                                </q-avatar>
                                <q-item-label>{{ admin.username }}</q-item-label>
                            </q-item-section>
                            <q-item-section v-if="isAdmin && myUserId != admin.id" side top>
                                <q-btn @click="editAdmin(admin.id, false)" flat dense round icon="delete">
                                    <q-tooltip>Remove from Admin</q-tooltip>
                                </q-btn>
                            </q-item-section>
                        </q-item>
                    </div>
                </q-tab-panel>
                <q-tab-panel name="banned">
                    <div>
                        <div>
                            <q-item v-for="ban in banned">
                                <q-item-section side>
                                    <q-avatar rounded>
                                        <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" />
                                    </q-avatar>
                                    <q-item-label>{{ ban.username }}</q-item-label>
                                </q-item-section>
                                <q-item-section v-if="isAdmin && myUserId != ban.id" side top>
                                    <q-btn @click="editBanned(ban.id, false)" flat dense round icon="delete">
                                        <q-tooltip>Unban</q-tooltip>
                                    </q-btn>
                                </q-item-section>
                            </q-item>
                        </div>
                    </div>
                </q-tab-panel>
            </q-tab-panels>
        </div>
    </div>
</template>

<script>
import store from "../../../store/index";

export default {
    name: "GroupMemberSetting",
    components: {
    },
    computed: {
        channelId() {
            return this.channel.id;
        },
        channelName() {
            return this.channel.name;
        },
        myUserId() {
            return store.state.auth.user.id;
        },
        isAdmin() {
            return this.administrators.find((a) => a.id == this.myUserId) != undefined;
        }
    },
    props: {
        channel: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            errors: {},
            errorMsg: "",
            showAlert: false,
            panel: 'members',
            members: [],
            banned: [],
            administrators: [],
        };
    },
    created() {
        this.getMembers();
        this.getBanned();
        this.getAdmin();
    },
    methods: {
        kickOff(uid) {
            store
                .dispatch("chat/kickOff", {
                    channelId: this.channelId,
                    targetUserId: uid
                }).then(() => {
                    this.getMembers();
                }).catch((error) => {
                    if (error.errors) this.errors = error.errors;
                    else this.errors = {};

                    if (error.message) {
                        this.errorMsg = error.message;
                        this.showAlert = true;
                    } else {
                        console.log(error);
                    }
                });
        },
        getMembers() {
            store
                .dispatch("chat/getGroupChannelProfile", {
                    channelId: this.channelId,
                }).then((res) => {
                    this.members = res.members;
                }).catch((error) => {
                    console.log(error);
                });
        },
        getBanned() {
            store
                .dispatch("chat/getBanned", {
                    channelId: this.channelId,
                }).then((res) => {
                    this.banned = res;
                }).catch((error) => {
                    console.log(error);
                });
        },
        editBanned(uid, isBanned) {
            store
                .dispatch("chat/editBanned", {
                    channelId: this.channelId,
                    targetUserId: uid,
                    isBanned: isBanned
                }).then(() => {
                    this.getBanned();
                }).catch((error) => {
                    if (error.errors) this.errors = error.errors;
                    else this.errors = {};

                    if (error.message) {
                        this.errorMsg = error.message;
                        this.showAlert = true;
                    } else {
                        console.log(error);
                    }
                });
        },
        getAdmin() {
            store
                .dispatch("chat/getAdmin", {
                    channelId: this.channelId,
                }).then((res) => {
                    this.administrators = res;
                }).catch((error) => {
                    console.log(error);
                });
        },
        editAdmin(uid, isAdmin) {
            store
                .dispatch("chat/editAdmin", {
                    channelId: this.channelId,
                    targetUserId: uid,
                    isAdmin: isAdmin
                }).then(() => {
                    this.getAdmin();
                }).catch((error) => {
                    if (error.errors) this.errors = error.errors;
                    else this.errors = {};

                    if (error.message) {
                        this.errorMsg = error.message;
                        this.showAlert = true;
                    } else {
                        console.log(error);
                    }
                });
        },
    }
};
</script>

<style scoped></style>