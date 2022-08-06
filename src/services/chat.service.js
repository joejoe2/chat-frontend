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
                return response;
            });
    }

    subscibeToPublicChannel(channelId) {
        return new EventSource(
            api.defaults.baseURL + '/api/channel/public/subscribe?channelId=' + channelId +
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
                return response;
            });
    }

    subscibeToPrivateChannel() {
        return new EventSource(
            api.defaults.baseURL + '/api/channel/private/subscribe?access_token='
            + encodeURIComponent((JSON.parse(localStorage.getItem("user")) || {}).access_token || '')
        );
    }
}

export default new ChatService();