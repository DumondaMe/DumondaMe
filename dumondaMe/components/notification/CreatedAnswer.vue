<template>
    <div class="notification-watch-commitment">
        <div class="notification-created">{{notification.created | formatRelativeTimesAgo}}</div>
        <div class="notification-user">
            <div class="user-image" @click="$router.push({name: 'user-userId-slug',
                     params: {userId: notification.users[0].userId, slug: notification.users[0].slug}})">
                <img :src="notification.users[0].thumbnailUrl"/>
            </div>
            <div class="user-info">
                <div class="user-info-container">
                        <span class="user-name" @click="$router.push({name: 'user-userId-slug',
                     params: {userId: notification.users[0].userId, slug: notification.users[0].slug}})">
                            {{notification.users[0].name}} </span>
                    <span v-if="notification.answerType !== 'Text'"
                         v-html="$t('pages:notifications.createdAnswer.notification', {question, type, answer})">
                    </span>
                    <span v-else
                         v-html="$t('pages:notifications.createdAnswer.notificationTextAnswer', {question})">
                    </span>
                </div>
            </div>
        </div>
        <div class="text-answer" v-if="notification.answerType === 'Text'">
            {{notification.answerTitle}}
        </div>
        <watched-command :notification="notification"></watched-command>
    </div>
</template>

<script>
    import Users from './Users';
    import WatchedCommand from './WatchedCommand';

    export default {
        props: ['notification'],
        components: {Users, WatchedCommand},
        computed: {
            question() {
                return `<a class="notification-title"
                           href="${this.questionLink()}">
                        ${this.notification.questionTitle}</a>`
            },
            type() {
                return this.$t(`common:answerType.${this.notification.answerType}`);
            },
            answer() {
                return `<a class="notification-title"
                           href="${this.questionLink()}">
                        ${this.notification.answerTitle}</a>`
            }
        },
        methods: {
            questionLink() {
                return `/question/${this.notification.questionId}/${this.notification.questionSlug}?answerId=${this.notification.answerId}`;
            }
        },
    }
</script>

<style lang="scss">
    .notification-watch-commitment {
        font-weight: 300;
        .notification-user {
            margin-top: 12px;
            display: block;
            clear: both;
            .user-image {
                cursor: pointer;
                float: left;
                height: 38px;
                width: 38px;
                margin-top: 4px;
                img {
                    height: 100%;
                    width: 100%;
                    border-radius: 2px;
                }
            }
            .user-info {
                margin-left: 52px;
                min-height: 38px;
                .user-info-container {
                    font-weight: 300;
                    font-size: 16px;
                    line-height: normal;
                    .user-name {
                        font-weight: 400;
                        color: $primary-color;
                        cursor: pointer;
                    }
                    :hover.user-name {
                        text-decoration: underline;
                    }
                }
                .created {
                    font-size: 12px;
                    color: $secondary-text;
                    margin-top: 2px;
                }
            }
        }
        .notification-description {
            margin-top: 12px;
            font-size: 16px;
        }
        .notification-title {
            font-weight: 400;
            color: $primary-color;
            text-decoration: none;
        }
        :hover.notification-title {
            text-decoration: underline;
        }
        .text-answer {
            margin-top: 12px;
            margin-bottom: 18px;
            font-style: italic;
        }
    }
</style>