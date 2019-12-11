<template>
    <div class="notification-one-time-watch-first-commitment">
        <div class="fist-commitment-title">{{$t('pages:notifications.oneTime.watchFirstCommitment.title')}}</div>
        <div class="description">{{$t('pages:notifications.oneTime.watchFirstCommitment.description')}}</div>
        <v-btn color="primary" class="go-to-questions"
               @click="$router.push({name: 'commitment'})">
            {{$t('pages:notifications.oneTime.watchFirstCommitment.goToCommitments')}}
        </v-btn>
    </div>
</template>

<script>

    export default {
        props: ['notification']
    }
</script>

<style lang="scss">
    .notification-one-time-watch-first-commitment {

        .fist-commitment-title {
            color: $primary-color;
            font-weight: 400;
            font-size: 22px;
        }

        .description {
            margin-top: 8px;
            font-weight: 300;
            font-size: 16px;
        }

        button.go-to-questions {
            display: block;
            margin-top: 16px;
            margin-left: 0;
        }
    }
</style>