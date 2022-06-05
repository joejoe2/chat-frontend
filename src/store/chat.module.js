import chatService from "../services/chat.service";

function parseError(error) {
    if (error.response && error.response.status == 400) {
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
        getPrivateChannelList() {
            return chatService.getPrivateChannelList().then(res => {
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
        getPrivateChannelMessagesOfUser() {
            return chatService.getAllPrivateChannelMessages().then((response) => {
                return response;
            }).catch(error => {
                return Promise.reject(parseError(error));
            });
        },
        getPrivateChannelMessagesOfUserSince(context, payload) {
            return chatService.getPrivateChannelMessagesSince(payload.since).then((response) => {
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
            return Promise.resolve(chatService.subscibeToPrivateChannel(payload.lastConnect));
        },
    },
    mutations: {},
};