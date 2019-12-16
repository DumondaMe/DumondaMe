<template>
    <div class="notification-one-time-welcome">
        <div class="welcome-title">{{$t('pages:notifications.oneTime.welcome.title')}}</div>
        <img v-lazy="imageUrl" class="welcome-image"/>
        <div class="description">{{$t('pages:notifications.oneTime.welcome.description')}}</div>
        <div class="go-to-notification-setting">
            <v-btn color="primary"
                   @click="$router.push({name: 'setting',query: {section: 'email'}})">
                {{$t('pages:notifications.oneTime.welcome.goToSetting')}}
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['notification'],
        computed: {
            imageUrl() {
                return `${process.env.staticUrl}/img/welcome/welcome.jpg`;
            }
        }
    }
</script>

<style lang="scss">
    .notification-one-time-welcome {
        font-weight: 300;

        .welcome-title {
            color: $primary-color;
            font-weight: 400;
            font-size: 22px;
            margin-bottom: 14px;
            @include defaultPaddingCard();
        }

        .welcome-image {
            width: 100%;
        }

        .description {
            margin-top: 8px;
            font-weight: 300;
            font-size: 16px;
            @include defaultPaddingCard();
        }

        .go-to-notification-setting {
            margin-top: 16px;
            margin-left: 0;
            @include defaultPaddingCard();
        }
    }
</style>