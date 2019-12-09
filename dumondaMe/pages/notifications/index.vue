<template>
    <div id="ely-user-logged-in-profile-layout">
        <feed-layout class="index-pages-container">
            <div slot="content" id="feed-detail-container">
                <notifications>
                </notifications>
            </div>
        </feed-layout>
    </div>
</template>

<script>
    import FeedLayout from '~/components/layouts/Detail';
    import Notifications from '~/components/notification/Notifications';

    export default {
        async fetch({store, error}) {
            try {
                store.commit(`notification/RESET_NOTIFICATION`);
                await store.dispatch(`notification/getNotifications`);
            } catch (e) {
                if (e && e.request && e.request.res && e.request.res.statusCode) {
                    error({statusCode: e.request.res.statusCode});
                } else if (e.message === 'Network Error') {
                    error({statusCode: 600});
                }
            }
            store.commit('toolbar/HIDE_BACK_BUTTON');
        },
        components: {FeedLayout, Notifications},
        mounted() {
            this.$store.dispatch('notification/stopCheckNotificationChanged');
        },
        async beforeDestroy() {
            await this.$store.dispatch('notification/startCheckNotificationChanged');
        }
    }
</script>

<style lang="scss">
    #ely-user-logged-in-profile-layout {
        padding-top: 32px;

        #ely-notification-detail {
            max-width: 700px;
        }
    }
</style>