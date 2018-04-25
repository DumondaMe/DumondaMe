<template>
    <div id="notifications-container">
        <div class="notification ely-card" v-for="notification in notifications">
            <show-question-request :notification="notification" v-if="notification.type === 'showQuestionRequest'">
            </show-question-request>
            <add-to-trust-circle :notification="notification" v-if="notification.type === 'addedToTrustCircle'">
            </add-to-trust-circle>
        </div>
        <div id="no-notifications" v-if="notifications.length === 0">
            {{$t("pages:notifications.noNotifications")}}
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import ShowQuestionRequest from './ShowQuestionRequest';
    import AddToTrustCircle from './AddToTrustCircle';

    export default {
        name: "notifications",
        components: {ShowQuestionRequest, AddToTrustCircle},
        computed: {
            ...mapGetters({
                notifications: 'notification/notifications'
            })
        },
    }
</script>

<style lang="scss">
    #notifications-container {
        .notification {
            margin-bottom: 12px;
            .notification-created {
                margin-bottom: 8px;
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