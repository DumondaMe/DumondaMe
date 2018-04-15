<template>
    <div id="notifications-container" class="ely-card">
        <div class="notification" v-for="notification in notifications">
            <show-question-request :notification="notification" v-if="notification.type = 'showQuestionRequest'">
            </show-question-request>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import ShowQuestionRequest from './ShowQuestionRequest';

    export default {
        name: "notifications",
        components: {ShowQuestionRequest},
        computed: {
            ...mapGetters({
                notifications: 'notification/notifications'
            })
        },
    }
</script>

<style lang="scss">
    #notifications-container {
        padding: 0;
        .notification {
            padding: 16px;
        }
    }
</style>