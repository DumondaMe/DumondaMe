<template>
    <div class="notification-watch-commitment">
        <div class="notification-created">{{notification.created | formatRelativeTimesAgo}}</div>
        <div class="notification-description" v-html="$t('pages:notifications.watchingCommitment.notification',
            {count: notification.numberOfUsers, commitment})">
        </div>
        <users :users="notification.users" :number-of-users="notification.numberOfUsers"></users>
    </div>
</template>

<script>
    import Users from './Users';

    export default {
        props: ['notification'],
        components: {Users},
        computed: {
            commitment() {
                return `<a class="commitment-title"
                           href="/commitment/${this.notification.commitmentId}/${this.notification.commitmentSlug}">
                        ${this.notification.commitmentTitle}</a>`
            }
        }
    }
</script>

<style lang="scss">
    .notification-watch-commitment {
        font-weight: 300;
        .notification-description {
            font-size: 16px;
        }
        .commitment-title {
            font-weight: 400;
            color: $primary-color;
            text-decoration: none;
        }
        :hover.commitment-title {
            text-decoration: underline;
        }
    }
</style>