<template>
    <div class="notification-one-time-watch-first-question">
        <div class="fist-question-title">{{$t('pages:notifications.oneTime.watchFirstQuestion.title')}}</div>
        <div class="description">{{$t('pages:notifications.oneTime.watchFirstQuestion.description')}}</div>
    </div>
</template>

<script>

    export default {
        props: ['notification']
    }
</script>

<style lang="scss">
    .notification-one-time-watch-first-question {

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