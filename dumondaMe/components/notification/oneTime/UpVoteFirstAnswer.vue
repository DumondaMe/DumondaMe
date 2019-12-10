<template>
    <div class="notification-one-time-upVote-first-answer">
        <div class="fist-question-title">{{$t('pages:notifications.oneTime.upVoteFirstAnswer.title')}}</div>
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

        .fist-question-title {
            color: $primary-color;
            font-weight: 400;
            font-size: 22px;
        }

        .description {
            margin-top: 8px;
            font-weight: 300;
            font-size: 16px;
        }
    }
</style>