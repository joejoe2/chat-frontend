import chatService from "../services/chat.service";

function parseError(error) {
    if (error.response && error.response.status / 100 == 4) {
        error.errors = error.response.data.errors;
        error.message = error.response.data.message || "";
    } else if (error.response && error.response.data) {
        error.message = error.response.data.message || "Unknown error, please try again later !";
    } else {
        error.message = "Unknown error, please try again later !";
    }
    return error;
}

export const chat = {
    namespaced: true,
    state: {},
    actions: {
        //public chat
        getPublicChannelList(context, pageParams) {
            return chatService.getPublicChannelList(pageParams.page, pageParams.size).then(res => {
                return Promise.resolve(res);
            }).catch(error => {
                return Promise.reject(parseError(error));
            });
        },
        craetePublicChannel(context, payload) {
            return chatService.createPublicChannel(payload.channelName).then((response) => {
                return response;
            }).catch(error => {
                return Promise.reject(parseError(error));
            });
        },
        getPublicChannelMessages(context, payload) {
            return chatService.getAllPublicChannelMessages(payload.channelId, payload.page, payload.size)
                .then((response) => {
                    return response;
                }).catch(error => {
                    return Promise.reject(parseError(error));
                });
        },
        getPublicChannelMessagesSince(context, payload) {
            return chatService.getPublicChannelMessagesSince(payload.channelId, payload.since, payload.page, payload.size)
                .then((response) => {
                    return response;
                }).catch(error => {
                    return Promise.reject(parseError(error));
                });
        },
        sendPublicChannelMessage(context, payload) {
            return chatService.sendPublicChannelMessage(payload.channelId, payload.message).then((response) => {
                return response;
            }).catch(error => {
                return Promise.reject(parseError(error));
            });
        },
        subscibeToPublicChannel(context, payload) {
            return Promise.resolve(chatService.subscibeToPublicChannel(payload.channelId));
        },
        //private chat
        getPrivateChannelProfile(context, payload) {
            return chatService.getPrivateChannelProfile(payload.channelId).then(res => {
                return Promise.resolve(res);
            }).catch(error => {
                return Promise.reject(parseError(error));
            });
        },
        getPrivateChannelList(context, payload) {
            return chatService.getPrivateChannelList(payload.page, payload.size).then(res => {
                return Promise.resolve(res);
            }).catch(error => {
                return Promise.reject(parseError(error));
            });
        },
        createPrivateChannel(context, payload) {
            return chatService.createPrivateChannelBetween(payload.chatWith).then((response) => {
                return response;
            }).catch(error => {
                return Promise.reject(parseError(error));
            });
        },
        getPrivateChannelMessagesOfUser(context, payload) {
            return chatService.getAllPrivateChannelMessages(payload.page, payload.size).then((response) => {
                return response;
            }).catch(error => {
                return Promise.reject(parseError(error));
            });
        },
        getPrivateChannelMessagesOfUserSince(context, payload) {
            return chatService.getPrivateChannelMessagesSince(payload.since, payload.page, payload.size).then((response) => {
                return response;
            }).catch(error => {
                return Promise.reject(parseError(error));
            });
        },
        sendPrivateChannelMessage(context, payload) {
            return chatService.sendPrivateChannelMessage(payload.channelId, payload.message).then((response) => {
                return response;
            }).catch(error => {
                return Promise.reject(parseError(error));
            });
        },
        subscibeToPrivateChannel(context, payload) {
            return Promise.resolve(chatService.subscibeToPrivateChannel());
        },
        //group chat
        getGroupChannelProfile(context, payload) {
            return chatService.getGroupChannelProfile(payload.channelId).then(res => {
                return Promise.resolve(res);
            }).catch(error => {
                return Promise.reject(parseError(error));
            });
        },
        getGroupChannelListSince(context, payload) {
            return chatService.getGroupChannelList(payload.since, payload.page, payload.size).then(res => {
                return Promise.resolve(res);
            }).catch(error => {
                return Promise.reject(parseError(error));
            });
        },
        createGroupChannel(context, payload) {
            return chatService.createGroupChannel(payload.channelName).then((response) => {
                return response;
            }).catch(error => {
                return Promise.reject(parseError(error));
            });
        },
        getGroupChannelMessagesSince(context, payload) {
            return chatService.getGroupChannelMessagesSince(payload.channelId, payload.since, payload.page, payload.size).then((response) => {
                return response;
            }).catch(error => {
                return Promise.reject(parseError(error));
            });
        },
        sendGroupChannelMessage(context, payload) {
            return chatService.sendGroupChannelMessage(payload.channelId, payload.message).then((response) => {
                return response;
            }).catch(error => {
                return Promise.reject(parseError(error));
            });
        },
        subscibeToGroupChannel(context, payload) {
            return Promise.resolve(chatService.subscibeToGroupChannel());
        },
        inviteToGroupChannel(context, payload) {
            return chatService.inviteToGroupChannel(payload.channelId, payload.targetUserId).then((response) => {
                return response;
            }).catch(error => {
                return Promise.reject(parseError(error));
            });
        },
        acceptInvitationToGroupChannel(context, payload) {
            return chatService.acceptInvitationToGroupChannel(payload.channelId).then((response) => {
                return response;
            }).catch(error => {
                return Promise.reject(parseError(error));
            });
        },
        getInvitations(context, payload){
            return chatService.getInvitations(payload.since, payload.page, payload.size).then((response) => {
                return response;
            }).catch(error => {
                return Promise.reject(parseError(error));
            });
        }
    },
    mutations: {},
};