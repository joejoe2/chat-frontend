<template>
    <div v-if="message.messageType == 'MESSAGE'">
        {{ message.content }}
    </div>
    <div v-if="message.messageType == 'INVITATION'">
        {{ 'Invite ' + message.content.username + ' to join.' }}
    </div>
    <div v-if="message.messageType == 'JOIN'">
        {{ message.from.username + ' join.' }}
    </div>
    <div v-else-if="message.messageType == 'LEAVE'">
        {{ message.content.username + ' leave the channel.' }}
    </div>
    <div v-else-if="message.messageType == 'BAN'">
        {{ message.from.username + ' ban ' + message.content.username + "." }}
    </div>
    <div v-else-if="message.messageType == 'UNBAN'">
        {{ message.from.username + ' unban ' + message.content.username + "." }}
    </div>
</template>

<script>

export default {
    name: "MessageTemplate",
    props: {
        message: {
            type: Object,
            required: true,
        }
    }
}

</script>