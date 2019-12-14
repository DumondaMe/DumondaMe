<template>
    <div class="notification-one-time-upVote-first-answer">
        <div class="first-upvote-title">
            <v-icon size="32" class="success-icon">mdi-check-circle-outline</v-icon>
            <div>{{$t('pages:notifications.oneTime.upVoteFirstAnswer.title')}}</div>
        </div>
        <div class="description">{{$t('pages:notifications.oneTime.upVoteFirstAnswer.description')}}</div>
    </div>
</template>

<script>

    export default {
        props: ['notification']
    }
</script>

<style lang="scss">
    .notification-one-time-upVote-first-answer {

        .first-upvote-title {
            display: flex;
            color: $success-text;
            font-weight: 400;
            font-size: 22px;

            .success-icon {
                margin-right: 8px;
            }

            .success-icon.v-icon {
                color: $success-text;
            }
        }

        .description {
            margin-top: 8px;
            font-weight: 300;
            font-size: 16px;
        }
    }
</style>