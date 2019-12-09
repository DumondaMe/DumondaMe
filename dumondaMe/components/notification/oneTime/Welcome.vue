<template>
    <div class="notification-one-time-welcome">
        <div class="welcome-title">{{$t('pages:notifications.oneTime.welcome.title')}}</div>
        <div class="description">{{$t('pages:notifications.oneTime.welcome.description')}}</div>
        <v-btn color="primary" class="go-to-notification-setting"
               @click="$router.push({name: 'setting',query: {section: 'email'}})">
            {{$t('pages:notifications.oneTime.welcome.goToSetting')}}
        </v-btn>
    </div>
</template>

<script>
    export default {
        props: ['notification']
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

        .description {
            margin-top: 8px;
            font-weight: 300;
            font-size: 16px;
        }

        button.go-to-notification-setting {
            display: block;
            margin-top: 16px;
            margin-left: 0;
        }
    }
</style>