<template>
    <div id="notifications-overview">
        <feed-layout class="index-pages-container">
            <div slot="sidebar">
                <challenge-status :challenge-status="challengeStatus">
                </challenge-status>
            </div>
            <div slot="content" id="notification-detail-container">
                <challenge-status :challenge-status="challengeStatus" class="mobile-challenge-info">
                </challenge-status>
                <notifications>
                </notifications>
            </div>
        </feed-layout>
    </div>
</template>

<script>
    import FeedLayout from '~/components/layouts/Detail';
    import Notifications from '~/components/notification/Notifications';
    import ChallengeStatus from '~/components/notification/info/ChallengeStatus';

    export default {
        async fetch({store, error}) {
            try {
                store.commit(`notification/RESET_NOTIFICATION`);
                await store.dispatch(`notification/getNotifications`);
            } catch (e) {
                if (e && e.request && e.request.res && e.request.res.statusCode) {
                    error({statusCode: e.request.res.statusCode});
                } else {
                    error();
                }
            }
            store.commit('toolbar/HIDE_BACK_BUTTON');
        },
        components: {FeedLayout, Notifications, ChallengeStatus},
        mounted() {
            this.$store.dispatch('notification/stopCheckNotificationChanged');
        },
        computed: {
          challengeStatus() {
              return this.$store.state.notification.challengeStatus;
          }
        },
        async beforeDestroy() {
            await this.$store.commit(`notification/ALL_READ`);
            await this.$store.dispatch('notification/startCheckNotificationChanged');
        }
    }
</script>

<style lang="scss">
    #notifications-overview {
        padding-top: 32px;

        #notification-detail-container {
        }

        .mobile-challenge-info {
            @media screen and (min-width: $xs + 1) {
                display: none;
            }
        }
    }
</style>