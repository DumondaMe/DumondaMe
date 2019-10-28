<template>
    <div class="notification-created-note">
        <div class="notification-created">{{notification.created | formatRelativeTimesAgo}}</div>
        <div class="notification-user">
            <div class="user-image" @click="navigateToUserProfile(notification.users[0])">
                <img :src="notification.users[0].thumbnailUrl"/>
            </div>
            <div class="user-info">
                <div class="user-info-container">
                    <span class="user-name" @click="navigateToUserProfile(notification.users[0])"
                          v-if="!notification.users[0].isAnonymous">
                            {{notification.users[0].name}} </span>
                    <v-tooltip bottom v-else>
                        <template v-slot:activator="{ on }">
                            <span class="user-name" v-on="on">
                            {{notification.users[0].name}} </span>
                        </template>
                        <span>{{$t('pages:notifications.notAllowedToNavigateToPerson')}}</span>
                    </v-tooltip>
                    <span v-if="notification.answerType !== 'Default'"
                          v-html="$t('pages:notifications.createdNote.notification', {question, type, answer})">
                    </span>
                    <span v-else
                          v-html="$t('pages:notifications.createdNote.notificationTextAnswer', {question, answer})">
                    </span>
                </div>
            </div>
        </div>
        <div class="text-answer">
            {{notification.noteText}}
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
                return `<a class="notification-title" href="${this.questionLink()}">
                           ${this.notification.questionTitle}</a>`
            },
            type() {
                return this.$t(`common:answerType.${this.notification.answerType}`);
            },
            answer() {
                let answer = this.notification.answerTitle;
                if (answer.length > 60) {
                    answer = answer.substring(0, 80) + '...';
                }
                return `<a class="notification-title main-notification" href="${this.questionLink()}">${answer}</a>`
            }
        },
        methods: {
            navigateToUserProfile(user) {
                if (user.isAnonymous === false) {
                    if (user.isHarvestingUser) {
                        this.$router.push({name: 'dumondaMeOnTour-userId', params: {userId: user.userId}})
                    } else {
                        this.$router.push({name: 'user-userId-slug', params: {userId: user.userId, slug: user.slug}});
                    }
                }
            },
            questionLink() {
                return `/question/${this.notification.questionId}/${this.notification.questionSlug}?answerId=${this.notification.answerId}`;
            }
        },
    }
</script>

<style lang="scss">
    .notification-created-note {
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
                        color: $primary-text;
                        font-weight: 500;
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
            color: $primary-text;
            font-weight: 400;
            text-decoration: none;
        }

        :hover.notification-title {
            text-decoration: underline;
        }

        .notification-title.main-notification {
            color: $primary-color;
        }

        .text-answer {
            margin-top: 12px;
            margin-bottom: 18px;
            font-style: italic;
        }
    }
</style>