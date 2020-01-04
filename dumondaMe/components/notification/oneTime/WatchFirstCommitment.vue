<template>
    <div class="notification-one-time-watch-first-commitment">
        <div class="first-commitment-title">
            <v-icon size="32" class="success-icon">{{$icons.mdiCheckCircleOutline}}</v-icon>
            <div>{{$t('pages:notifications.oneTime.watchFirstCommitment.title')}}</div>
        </div>
        <div class="description">{{$t('pages:notifications.oneTime.watchFirstCommitment.description')}}</div>
        <v-btn color="primary" class="go-to-questions"
               @click="$router.push({name: 'commitment'})">
            {{$t('pages:notifications.oneTime.watchFirstCommitment.goToCommitments')}}
        </v-btn>
    </div>
</template>

<script>
    import {mdiCheckCircleOutline} from "@mdi/js";

    export default {
        props: ['notification'],
        created() {
            this.$icons = {mdiCheckCircleOutline}
        }
    }
</script>

<style lang="scss">
    .notification-one-time-watch-first-commitment {

        .first-commitment-title {
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

        button.go-to-questions {
            display: block;
            margin-top: 16px;
            margin-left: 0;
        }
    }
</style>