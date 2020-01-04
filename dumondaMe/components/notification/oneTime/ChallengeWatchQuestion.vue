<template>
    <div class="notification-one-time-challenge-watch-question">
        <div class="welcome-title">{{$t('pages:notifications.oneTime.challengeWatchQuestion.title')}}</div>
        <div class="description-container">
            <div class="star-container">
                <v-icon size="50" color="primary">$vuetify.icons.mdiStarOutline</v-icon>
            </div>
            <div class="description">{{$t('pages:notifications.oneTime.challengeWatchQuestion.description')}}</div>
        </div>
        <v-btn color="primary" class="go-to-notification-setting"
               @click="$router.push({name: 'question'})">
            {{$t('pages:notifications.oneTime.challengeWatchQuestion.goToQuestions')}}
        </v-btn>
    </div>
</template>

<script>

    export default {
        props: ['notification']
    }
</script>

<style lang="scss">
    .notification-one-time-challenge-watch-question {
        font-weight: 300;

        .welcome-title {
            color: $secondary-color;
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

        button.go-to-notification-setting {
            display: block;
            margin-top: 16px;
            margin-left: 0;
        }
    }
</style>