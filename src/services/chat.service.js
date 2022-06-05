import api from './chat-api';
import authHeader from './auth-header';

class ChatService {
    //public channel
    getPublicChannelList(page, size) {
        return api.post('/api/channel/public/list', { page: page, size: size }, { headers: authHeader() })
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
        return api.post('/api/channel/public/getAllMessages',
            { channelId: channelId, page: page, size: size }, { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    getPublicChannelMessagesSince(channelId, since, page, size) {
        return api.post('/api/channel/public/getMessagesSince',
            { channelId: channelId, since: since, page: page, size: size }, { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    sendPublicChannelMessage(channelId, message) {
        return api.post('/api/channel/public/publishMessage', { channelId: channelId, message: message }, { headers: authHeader() })
            .then(response => {
                return response;
            });
    }

    subscibeToPublicChannel(channelId) {
        return new EventSource(
            api.defaults.baseURL + '/api/channel/public/subscribe?channelId=' + channelId +
            "&access_token=" + encodeURIComponent(JSON.parse(localStorage.getItem("user")).access_token)
        );
    }

    //private channel
    getPrivateChannelList() {
        return api.post('/api/channel/private/list', {}, { headers: authHeader() })
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

    getAllPrivateChannelMessages() {
        return api.post('/api/channel/private/getAllMessages', {}, { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    getPrivateChannelMessagesSince(since) {
        return api.post('/api/channel/private/getMessagesSince', { since: since }, { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    sendPrivateChannelMessage(channelId, message) {
        return api.post('/api/channel/private/publishMessage', { channelId: channelId, message: message }, { headers: authHeader() })
            .then(response => {
                return response;
            });
    }

    subscibeToPrivateChannel(lastConnect) {
        return new EventSource(
            api.defaults.baseURL + '/api/channel/private/subscribe?' +
            "lastConnect=" + encodeURIComponent(lastConnect) +
            "&access_token=" + encodeURIComponent(JSON.parse(localStorage.getItem("user")).access_token)
        );
    }
}

export default new ChatService();
