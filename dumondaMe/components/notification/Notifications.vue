<template>
    <div id="notifications-container">
        <div class="notification ely-card" :class="{'unread-notification': !notification.read}"
             v-for="notification in notifications">
            <div class="notification-with-default-padding">
                <show-question-request :notification="notification"
                                       v-if="notification.type === 'showQuestionRequest'">
                </show-question-request>
                <admin-of-commitment-request :notification="notification"
                                             v-else-if="notification.type === 'requestAdminOfCommitment'">
                </admin-of-commitment-request>
                <add-to-trust-circle :notification="notification"
                                     v-else-if="notification.type === 'addedToTrustCircle'">
                </add-to-trust-circle>
                <invited-user-has-registered :notification="notification"
                                             v-else-if="notification.type === 'invitedUserHasRegistered'">
                </invited-user-has-registered>
                <watch-commitment :notification="notification"
                                  v-else-if="notification.type === 'watchingCommitment'">
                </watch-commitment>
                <watch-question :notification="notification" v-else-if="notification.type === 'watchingQuestion'">
                </watch-question>
                <new-question :notification="notification" v-else-if="notification.type === 'newQuestion'">
                </new-question>
                <created-answer :notification="notification" v-else-if="notification.type === 'createdAnswer'">
                </created-answer>
                <created-note :notification="notification" v-else-if="notification.type === 'createdNote'">
                </created-note>

                <one-time-challenge-up-vote-answer :notification="notification"
                                                   v-else-if="notification.type === 'oneTimeChallengeUpVoteAnswer'">
                </one-time-challenge-up-vote-answer>
                <one-time-challenge-watch-question :notification="notification"
                                                   v-else-if="notification.type === 'oneTimeWatchQuestion'">
                </one-time-challenge-watch-question>
                <one-time-up-vote-first-answer :notification="notification"
                                               v-else-if="notification.type === 'oneTimeUpVoteFirstAnswer'">
                </one-time-up-vote-first-answer>
                <one-time-watch-first-question :notification="notification"
                                               v-else-if="notification.type === 'oneTimeWatchingFirstQuestion'">
                </one-time-watch-first-question>
                <one-time-watch-first-commitment :notification="notification"
                                               v-else-if="notification.type === 'oneTimeWatchingFirstCommitment'">
                </one-time-watch-first-commitment>
                <one-time-first-trust-circle-user :notification="notification"
                                               v-else-if="notification.type === 'oneTimeFirstTrustCircleUser'">
                </one-time-first-trust-circle-user>
            </div>
            <one-time-welcome :notification="notification" v-if="notification.type === 'oneTimeWelcome'">
            </one-time-welcome>
            <one-time-invite-friends :notification="notification" v-if="notification.type === 'oneTimeInviteFriends'">
            </one-time-invite-friends>
        </div>
        <v-btn outlined color="primary" id="load-next-button" v-if="hasMoreNotifications"
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
    import AdminOfCommitmentRequest from './AdminOfCommitmentRequest';
    import AddToTrustCircle from './AddToTrustCircle';
    import WatchCommitment from './WatchCommitment';
    import WatchQuestion from './WatchQuestion';
    import NewQuestion from './NewQuestion';
    import CreatedAnswer from './CreatedAnswer';
    import CreatedNote from './CreatedNote';
    import InvitedUserHasRegistered from './InvitedUserHasRegistered';

    import OneTimeChallengeUpVoteAnswer from './oneTime/ChallengeUpVoteAnswer';
    import OneTimeChallengeWatchQuestion from './oneTime/ChallengeWatchQuestion';
    import OneTimeFirstTrustCircleUser from './oneTime/FirstTrustCircleUser';
    import OneTimeUpVoteFirstAnswer from './oneTime/UpVoteFirstAnswer';
    import OneTimeWatchFirstQuestion from './oneTime/WatchFirstQuestion';
    import OneTimeWatchFirstCommitment from './oneTime/WatchFirstCommitment';
    import OneTimeWelcome from './oneTime/Welcome';
    import OneTimeInviteFriends from './oneTime/InviteFriends';

    export default {
        name: "notifications",
        components: {
            ShowQuestionRequest, AdminOfCommitmentRequest, AddToTrustCircle, WatchCommitment, WatchQuestion,
            NewQuestion, CreatedAnswer, CreatedNote, InvitedUserHasRegistered, OneTimeChallengeUpVoteAnswer,
            OneTimeChallengeWatchQuestion, OneTimeUpVoteFirstAnswer, OneTimeWatchFirstQuestion, OneTimeWelcome,
            OneTimeInviteFriends, OneTimeFirstTrustCircleUser, OneTimeWatchFirstCommitment
        },
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
                margin-bottom: 8px;
            }

            .notification-with-default-padding {
                @include defaultPaddingCard();
            }

            .notification-created {
                margin-bottom: 8px;
                font-size: 12px;
            }

            .notification-challenge {
                display: inline;
                font-size: 12px;
                font-weight: 500;
                background: $secondary-color;
                color: white;
                padding: 2px 4px;
                border-radius: 2px;
            }
        }

        .notification.unread-notification {
            border: 1px solid $secondary-color;
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