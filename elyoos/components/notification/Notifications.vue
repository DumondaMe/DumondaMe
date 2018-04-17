<template>
    <div id="notifications-container">
        <div class="notification" v-for="(notification, index) in notifications"
             :class="{'show-border': index < notifications.length - 1}">
            <show-question-request :notification="notification" v-if="notification.type === 'showQuestionRequest'">
            </show-question-request>
        </div>
        <div id="no-notifications" v-if="notifications.length === 0">
            {{$t("pages:notifications.noNotifications")}}
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
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        background-color: #ffffff;
        box-shadow: none;
        .notification {
            padding: 16px;
            .notification-created {
                font-size: 12px;
                color: $secondary-text;
            }
        }
        .show-border {
            border-bottom: 1px solid #e0e0e0;
        }
        #no-notifications {
            padding: 16px;
            font-size: 18px;
            font-weight: 300;
            text-align: center;
        }
    }
</style>