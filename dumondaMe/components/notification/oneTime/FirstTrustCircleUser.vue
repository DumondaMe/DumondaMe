<template>
    <div class="notification-one-time-first-trust-circle-user">
        <div class="fist-title">{{$t('pages:notifications.oneTime.firstTrustCircleUser.title')}}</div>
        <div class="description">{{$t('pages:notifications.oneTime.firstTrustCircleUser.description')}}</div>
    </div>
</template>

<script>

    export default {
        props: ['notification']
    }
</script>

<style lang="scss">
    .notification-one-time-first-trust-circle-user {

        .fist-title {
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