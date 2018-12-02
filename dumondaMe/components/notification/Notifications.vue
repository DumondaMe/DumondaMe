<template>
    <div id="notifications-container">
        <div class="notification ely-card" :class="{'unread-notification': !notification.read}"
             v-for="notification in notifications">
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
            <created-note :notification="notification" v-if="notification.type === 'createdNote'">
            </created-note>
        </div>
        <v-btn outline color="primary" id="load-next-button" v-if="hasMoreNotifications"
               @click="loadNextNotifications" :disabled="loadingNextNotifications" :loading="loadingNextNotifications">
            {{$t("common:button.showMore")}}
        </v-btn>
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
    import CreatedNote from './CreatedNote';

    export default {
        name: "notifications",
        components: {ShowQuestionRequest, AddToTrustCircle, WatchCommitment, WatchQuestion, CreatedAnswer, CreatedNote},
        data() {
            return {loadingNextNotifications: false}
        },
        computed: {
            hasMoreNotifications() {
                return this.$store.state.notification.hasMoreNotifications
            },
            ...mapGetters({
                notifications: 'notification/notifications'
            })
        },
        methods: {
            async loadNextNotifications() {
                try {
                    this.loadingNextNotifications = true;
                    await this.$store.dispatch('notification/getNotifications');
                } finally {
                    this.loadingNextNotifications = false;
                }
            }
        }
    }
</script>

<style lang="scss">
    #notifications-container {
        .notification {
            margin-bottom: 12px;
            @media screen and (max-width: $xs) {
                padding: 16px;
                margin-bottom: 0;
            }

            .notification-created {
                margin-bottom: 8px;
                font-size: 12px;
            }
        }

        .notification.unread-notification {
            background-color: #EEEEEE;
            @media screen and (min-width: $xs) {
                border: 2px solid $divider;
            }
        }

        #load-next-button {
            margin-left: 0;
        }

        .show-border {
            border-bottom: 1px solid #E0F2F1;
        }

        #no-notifications {
            padding: 16px;
            font-size: 18px;
            font-weight: 300;
            text-align: center;
        }
    }
</style>