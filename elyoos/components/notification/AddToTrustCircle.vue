<template>
    <div class="notification-added-to-trust-circle">
        <div class="notification-created">{{notification.created | formatRelativeTimesAgo}}</div>
        <div class="notification-description">
            {{$t('pages:notifications.addToTrustCircle.notification', {count: notification.numberOfUsers})}}
        </div>
        <users :users="notification.users" :number-of-users="notification.numberOfUsers"></users>
        <watched-command :notification="notification"></watched-command>
    </div>
</template>

<script>
    import Users from './Users';
    import WatchedCommand from './WatchedCommand';

    export default {
        props: ['notification'],
        components: {Users, WatchedCommand}
    }
</script>

<style lang="scss">
    .notification-added-to-trust-circle {
        font-weight: 300;
        .notification-description {
            font-size: 16px;
        }
    }
</style>