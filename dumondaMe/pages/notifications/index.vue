<template>
    <div id="ely-user-logged-in-profile-layout">
        <div id="ely-notification-detail">
            <notifications>
            </notifications>
        </div>
    </div>
</template>

<script>
    import Notifications from '~/components/notification/Notifications';

    export default {
        async fetch({store, error}) {
            try {
                store.commit(`notification/RESET_NOTIFICATION`);
                await store.dispatch(`notification/getNotifications`);
            } catch (e) {
                error({statusCode: e.statusCode})
            }
        },
        components: {Notifications},
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
        #ely-notification-detail {
            max-width: 700px;
            margin: 0 auto;
        }
    }
</style>