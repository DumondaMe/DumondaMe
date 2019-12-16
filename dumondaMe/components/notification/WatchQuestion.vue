<template>
    <div class="notification-watch-commitment">
        <div class="notification-created">{{notification.created | formatRelativeTimesAgo}}</div>
        <div class="notification-description" v-html="$t('pages:notifications.watchingQuestion.notification',
            {count: notification.numberOfUsers, question})">
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
            question() {
                return `<a class="question-title"
                           href="/question/${this.notification.questionId}/${this.notification.questionSlug}">
                        ${this.notification.questionTitle}</a>`
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
        .question-title {
            font-weight: 400;
            color: $primary-color;
            text-decoration: none;
        }
        :hover.question-title {
            text-decoration: underline;
        }
    }
</style>