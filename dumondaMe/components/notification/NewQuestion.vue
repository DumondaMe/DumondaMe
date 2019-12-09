<template>
    <div class="notification-new-question">
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

                    <span v-html="$t('pages:notifications.newQuestion.notification', {question})">
                    </span>
                </div>
            </div>
        </div>
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
            }
        }
    }
</script>

<style lang="scss">
    .notification-new-question {
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
                        font-weight: 500;
                        color: $primary-text;
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