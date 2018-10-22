<template>
    <div id="notifications-container">
        <div class="notification ely-card" v-for="notification in notifications">
            <show-question-request :notification="notification" v-if="notification.type === 'showQuestionRequest'">
            </show-question-request>
            <add-to-trust-circle :notification="notification" v-if="notification.type === 'addedToTrustCircle'">
            </add-to-trust-circle>
            <watch-commitment :notification="notification" v-if="notification.type === 'watchingCommitment'">
            </watch-commitment>
            <watch-question :notification="notification" v-if="notification.type === 'watchingQuestion'">
            </watch-question>
            <created-answer :notification="notification" v-if="notification.type === 'createdAnswer'">
            </created-answer>
        </div>
        <div id="no-notifications" class="ely-card" v-if="notifications.length === 0">
            {{$t("pages:notifications.noNotifications")}}
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import ShowQuestionRequest from './ShowQuestionRequest';
    import AddToTrustCircle from './AddToTrustCircle';
    import WatchCommitment from './WatchCommitment';
    import WatchQuestion from './WatchQuestion';
    import CreatedAnswer from './CreatedAnswer';

    export default {
        name: "notifications",
        components: {ShowQuestionRequest, AddToTrustCircle, WatchCommitment, WatchQuestion, CreatedAnswer},
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
            @media screen and (max-width: $sm) {
                padding: 16px;
                margin-bottom: 0;
            }
            .notification-created {
                margin-bottom: 8px;
                font-size: 12px;
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