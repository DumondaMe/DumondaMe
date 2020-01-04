<template>
    <div class="notification-one-time-challenge-watch-commitment">
        <div class="challenge-title">{{$t('pages:notifications.oneTime.challengeWatchCommitment.title')}}</div>
        <div class="description-container">
            <div class="star-container">
                <v-icon size="50" color="primary">$vuetify.icons.mdiStarOutline</v-icon>
            </div>
            <div class="description">{{$t('pages:notifications.oneTime.challengeWatchCommitment.description')}}</div>
        </div>
        <v-btn color="primary" class="go-to-commitment"
               @click="$router.push({name: 'commitment'})">
            {{$t('pages:notifications.oneTime.challengeWatchCommitment.goToCommitments')}}
        </v-btn>
    </div>
</template>

<script>

    export default {
        props: ['notification']
    }
</script>

<style lang="scss">
    .notification-one-time-challenge-watch-commitment {

        .challenge-title {
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

        button.go-to-commitment {
            display: block;
            margin-top: 16px;
            margin-left: 0;
        }
    }
</style>