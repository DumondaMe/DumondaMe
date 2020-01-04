<template>
    <div class="notification-one-time-challenge-upvote-answer">
        <div class="upvote-title">{{$t('pages:notifications.oneTime.challengeUpVoteAnswer.title')}}</div>
        <div class="description-container">
            <div class="up-vote-container">
                <v-icon size="40" color="primary">$vuetify.icons.mdiThumbUpOutline</v-icon>
            </div>
            <div class="description">{{$t('pages:notifications.oneTime.challengeUpVoteAnswer.description')}}</div>
        </div>
    </div>
</template>

<script>

    export default {
        props: ['notification']
    }
</script>

<style lang="scss">
    .notification-one-time-challenge-upvote-answer {
        font-weight: 300;

        .upvote-title {
            color: $secondary-color;
            font-weight: 400;
            font-size: 22px;
        }

        .description-container {
            display: flex;

            .up-vote-container {
                padding-top: 12px;
                margin-right: 16px;
            }

            .description {
                margin-top: 8px;
                font-weight: 300;
                font-size: 16px;
            }
        }
    }
</style>