import api from './chat-api';
import authHeader from './auth-header';

class ChatService {
    //public channel
    getPublicChannelList(page, size) {
        return api.get('/api/channel/public/list', { headers: authHeader(), params: { page: page, size: size } })
            .then(response => {
                return response.data;
            });
    }

    createPublicChannel(channelName) {
        return api.post('/api/channel/public/create', { channelName: channelName }, { headers: authHeader() })
            .then(response => {
                return response;
            });
    }

    getAllPublicChannelMessages(channelId, page, size) {
        return api.get('/api/channel/public/getAllMessages',
            { headers: authHeader(), params: { channelId: channelId, pageRequest: { page: page, size: size } } })
            .then(response => {
                return response.data;
            });
    }

    getPublicChannelMessagesSince(channelId, since, page, size) {
        return api.get('/api/channel/public/getMessagesSince',
            { headers: authHeader(), params: { channelId: channelId, since: since, pageRequest: { page: page, size: size } } })
            .then(response => {
                return response.data;
            });
    }

    sendPublicChannelMessage(channelId, message) {
        return api.post('/api/channel/public/publishMessage', { channelId: channelId, message: message }, { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    subscibeToPublicChannel(channelId) {
        return new WebSocket(
            api.defaults.baseURL.replace("http", "ws") + '/ws/channel/public/subscribe?channelId=' + channelId +
            "&access_token=" + encodeURIComponent((JSON.parse(localStorage.getItem("user")) || {}).access_token || '')
        );
    }

    //private channel
    getPrivateChannelProfile(channelId) {
        return api.get('/api/channel/private/profile', { headers: authHeader(), params: { channelId: channelId } })
            .then(response => {
                return response.data;
            });
    }

    getPrivateChannelList(page, size) {
        return api.get('/api/channel/private/list', { headers: authHeader(), params: { page: page, size: size } })
            .then(response => {
                return response.data;
            });
    }

    createPrivateChannelBetween(targetUserId) {
        return api.post('/api/channel/private/create', { targetUserId: targetUserId }, { headers: authHeader() })
            .then(response => {
                return response;
            });
    }

    getAllPrivateChannelMessages(page, size) {
        return api.get('/api/channel/private/getAllMessages', { headers: authHeader(), params: { page: page, size: size } })
            .then(response => {
                return response.data;
            });
    }

    getPrivateChannelMessagesSince(since, page, size) {
        return api.get('/api/channel/private/getMessagesSince',
            { headers: authHeader(), params: { since: since, pageRequest: { page: page, size: size } } })
            .then(response => {
                return response.data;
            });
    }

    sendPrivateChannelMessage(channelId, message) {
        return api.post('/api/channel/private/publishMessage', { channelId: channelId, message: message }, { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    subscibeToPrivateChannel() {
        return new WebSocket(
            api.defaults.baseURL.replace("http", "ws") + '/ws/channel/private/subscribe?access_token='
            + encodeURIComponent((JSON.parse(localStorage.getItem("user")) || {}).access_token || '')
        );
    }

    blockPrivateChannel(channelId, isBlocked) {
        return api.post('/api/channel/private/blockage', { channelId: channelId, isBlocked: isBlocked }, { headers: authHeader() });
    }

    //group channel
    createGroupChannel(channelName) {
        return api.post('/api/channel/group/create', { channelName: channelName }, { headers: authHeader() })
            .then(response => {
                return response;
            });
    }

    getGroupChannelProfile(channelId) {
        return api.get('/api/channel/group/profile', { headers: authHeader(), params: { channelId: channelId } })
            .then(response => {
                return response.data;
            });
    }

    getGroupChannelList(since, page, size) {
        return api.get('/api/channel/group/list', { headers: authHeader(), params: { since: since, pageRequest: { page: page, size: size } } })
            .then(response => {
                return response.data;
            });
    }

    getGroupChannelMessagesSince(channelId, since, page, size) {
        return api.get('/api/channel/group/getMessagesSince',
            { headers: authHeader(), params: { channelId: channelId, since: since, pageRequest: { page: page, size: size } } })
            .then(response => {
                return response.data;
            });
    }

    subscibeToGroupChannel() {
        return new WebSocket(
            api.defaults.baseURL.replace("http", "ws") + '/ws/channel/group/subscribe?access_token='
            + encodeURIComponent((JSON.parse(localStorage.getItem("user")) || {}).access_token || '')
        );
    }

    sendGroupChannelMessage(channelId, message) {
        return api.post('/api/channel/group/publishMessage', { channelId: channelId, message: message }, { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    inviteToGroupChannel(channelId, targetUserId) {
        return api.post('/api/channel/group/invite', { channelId: channelId, targetUserId: targetUserId }, { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    acceptInvitationToGroupChannel(channelId) {
        return api.post('/api/channel/group/accept', { channelId: channelId }, { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    getInvitations(since, page, size) {
        return api.get('/api/channel/group/invitation',
            { headers: authHeader(), params: { since: since, pageRequest: { page: page, size: size } } })
            .then(response => {
                return response.data;
            });
    }

    kickOff(channelId, targetUserId) {
        return api.post('/api/channel/group/kickOff', { channelId: channelId, targetUserId: targetUserId }, { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    leave(channelId) {
        return api.post('/api/channel/group/leave', { channelId: channelId }, { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    getBanned(channelId) {
        return api.get('/api/channel/group/banned',
            { headers: authHeader(), params: { channelId: channelId } })
            .then(response => {
                return response.data;
            });
    }

    editBanned(channelId, targetUserId, isBanned) {
        return api.post('/api/channel/group/editBanned', { channelId: channelId, targetUserId: targetUserId, isBanned: isBanned }, { headers: authHeader() })
            .then(response => {
                return response;
            });
    }

    getAdmin(channelId) {
        return api.get('/api/channel/group/admin',
            { headers: authHeader(), params: { channelId: channelId } })
            .then(response => {
                return response.data;
            });
    }

    editAdmin(channelId, targetUserId, isAdmin) {
        return api.post('/api/channel/group/editAdmin', { channelId: channelId, targetUserId: targetUserId, isAdmin: isAdmin }, { headers: authHeader() })
            .then(response => {
                return response;
            });
    }
}

export default new ChatService();
