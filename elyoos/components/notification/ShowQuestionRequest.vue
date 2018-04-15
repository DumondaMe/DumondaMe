<template>
    <div class="notification-show-question-request">
        <div class="notification-created">{{notification.created | formatRelativeTimesAgo}}</div>
        <div class="notification-title" v-html="$t('pages:notifications.showQuestionRequest.notification', {
                           commitment: notification.commitmentTitle, question: notification.question})">
        </div>
        <div class="commands-container">
            <v-btn outline color="success">
                <v-icon>done</v-icon>
                {{$t('common:button.yes')}}
            </v-btn>
            <v-btn outline color="error">
                <v-icon>clear</v-icon>
                {{$t('common:button.no')}}
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ShowQuestionRequest",
        props: ['notification'],
    }
</script>

<style lang="scss">
    .notification-show-question-request {
        .notification-title {
            .bold {
                color: $primary-color;
            }
        }
        .commands-container {
            margin-top: 6px;
            button {
                margin-left: 0;
                margin-right: 16px;
            }
        }
    }
</style>