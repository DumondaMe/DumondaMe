<template>
    <div class="notification-one-time-simple-challenge-completed">
        <div class="challenge-completed-title">
            <v-icon size="32" class="success-icon">mdi-check-circle-outline</v-icon>
            <div>{{text}}</div>
        </div>
    </div>
</template>

<script>

    export default {
        props: ['notification', 'text']
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