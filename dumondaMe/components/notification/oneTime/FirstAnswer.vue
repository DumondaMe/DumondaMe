<template>
    <div class="notification-one-time-first-answer">
        <div class="first-answer-title">
            <v-icon size="32" class="success-icon">mdi-check-circle-outline</v-icon>
            <div>{{$t('pages:notifications.oneTime.firstAnswer.title')}}</div>
        </div>
    </div>
</template>

<script>

    export default {
        props: ['notification']
    }
</script>

<style lang="scss">
    .notification-one-time-first-answer {

        .first-answer-title {
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