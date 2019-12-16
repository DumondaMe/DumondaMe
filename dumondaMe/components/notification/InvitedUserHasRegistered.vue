<template>
    <div class="notification-invited-user-has-registered">
        <div class="notification-created">{{notification.created | formatRelativeTimesAgo}}</div>
        <div class="notification-description">
            {{$t('pages:notifications.invitedUserHasRegistered.notification')}}
        </div>
        <users :users="notification.users" :number-of-users="notification.users.length"></users>
    </div>
</template>

<script>
    import Users from './Users';

    export default {
        props: ['notification'],
        components: {Users}
    }
</script>

<style lang="scss">
    .notification-invited-user-has-registered {
        font-weight: 300;
        .notification-description {
            font-size: 16px;
        }
    }
</style>