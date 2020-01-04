<template>
    <div class="notification-one-time-simple-challenge-completed">
        <div class="challenge-completed-title">
            <v-icon size="32" class="success-icon">{{$icons.mdiCheckCircleOutline}}</v-icon>
            <div>{{text}}</div>
        </div>
    </div>
</template>

<script>
    import {mdiCheckCircleOutline} from "@mdi/js";

    export default {
        props: ['notification', 'text'],
        created() {
            this.$icons = {mdiCheckCircleOutline}
        }
    }
</script>

<style lang="scss">
    .notification-one-time-simple-challenge-completed {

        .challenge-completed-title {
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
    }
</style>