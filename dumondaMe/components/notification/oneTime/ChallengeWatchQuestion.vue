<template>
    <div class="notification-one-time-welcome">
        <div class="notification-created">{{notification.created | formatRelativeTimesAgo}}</div>
        <div class="welcome-title">{{$t('pages:notifications.oneTime.challengeWatchQuestion.title')}}</div>
        <div class="description-container">
            <div class="star-container">
                <v-icon size="50" color="secondary">mdi-star</v-icon>
            </div>
            <div class="description">{{$t('pages:notifications.oneTime.challengeWatchQuestion.description')}}</div>
        </div>
        <watched-command :notification="notification">
            <template v-slot:additionalCommands>
                <v-btn color="primary" text class="go-to-notification-setting"
                       @click="$router.push({name: 'question'})">
                    {{$t('pages:notifications.oneTime.challengeWatchQuestion.goToQuestions')}}
                </v-btn>
            </template>
        </watched-command>
    </div>
</template>

<script>
    import WatchedCommand from './../WatchedCommand';

    export default {
        props: ['notification'],
        components: {WatchedCommand},
        computed: {},
        methods: {}
    }
</script>

<style lang="scss">
    .notification-one-time-welcome {
        font-weight: 300;

        .welcome-title {
            color: $primary-color;
            font-weight: 400;
            font-size: 22px;
        }

        .description-container {
            display: flex;

            .star-container {
                padding-top: 8px;
                margin-right: 8px;
            }

            .description {
                margin-top: 8px;
                font-weight: 300;
                font-size: 16px;
            }
        }

        .go-to-notification-setting {
            margin-left: 18px;
        }
    }
</style>