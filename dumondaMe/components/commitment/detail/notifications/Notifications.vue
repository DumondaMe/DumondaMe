<template>
    <div id="commitment-notifications-container" v-if="notifications.length > 0">
        <h2>{{$t('pages:detailCommitment.notifications.title')}}</h2>
        <div class="notification ely-card" v-for="notification in notifications">
            <show-question-request :notification="notification" v-if="notification.type === 'showQuestionRequest'">
            </show-question-request>
        </div>
    </div>
</template>

<script>
    import ShowQuestionRequest from './ShowQuestionRequest';

    export default {
        name: "notifications",
        components: {ShowQuestionRequest},
        computed: {
            notifications() {
                return this.$store.state.notification.notifications.filter(notification => {
                        return notification.type === 'showQuestionRequest' &&
                            notification.commitmentId === this.$route.params.commitmentId &&
                            !notification.read;
                    }
                )
            }
        }
    }
</script>

<style lang="scss">
    #commitment-notifications-container {
        h2 {
            color: $secondary-color;
            @media screen and (max-width: $xs) {
                margin-left: 16px;
                font-weight: 500;
                margin-top: 8px;
                margin-bottom: 0;
                border-bottom: none;
            }
        }
        .notification {
            padding: 16px;
            margin-bottom: 8px;
            .notification-created {
                font-size: 12px;
                color: $secondary-text;
            }
        }
    }
</style>