<template>
    <div class="notification-one-time-first-trust-circle-user">
        <div class="first-trust-circle-title">
            <v-icon size="32" class="success-icon">{{$icons.mdiCheckCircleOutline}}</v-icon>
            <div>{{$t('pages:notifications.oneTime.firstTrustCircleUser.title')}}</div>
        </div>
        <div class="description">{{$t('pages:notifications.oneTime.firstTrustCircleUser.description')}}</div>
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
    .notification-one-time-first-trust-circle-user {

        .first-trust-circle-title {
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