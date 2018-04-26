<template>
    <div class="notification-show-question-request">
        <div class="notification-created">{{notification.created | formatRelativeTimesAgo}}</div>
        <div class="notification-title" v-if="!notification.removed">
            {{$t('pages:notifications.showQuestionRequest.notification1')}}
            <span class="bold" @click="$router.push({name: 'commitment-commitmentId-slug',
                     params: {commitmentId: notification.commitmentId, slug: notification.commitmentSlug}})">
                {{notification.commitmentTitle}}</span>
            {{$t('pages:notifications.showQuestionRequest.notification2')}}
            <span class="bold" @click="$router.push({name: 'question-questionId-slug',
                     params: {questionId: notification.questionId, slug: notification.questionSlug}})">
                {{notification.question}}</span>
            {{$t('pages:notifications.showQuestionRequest.notification3')}}
        </div>
        <div class="commands-container" v-if="!notification.removed">
            <v-btn outline color="success" @click="setShowQuestionOnCommitment(true, 'requestShowQuestionRunning')"
                   :loading="requestShowQuestionRunning"
                   :disabled="requestShowQuestionRunning || requestHideQuestionRunning">
                <v-icon>mdi-check</v-icon>
                {{$t('common:button.yes')}}
            </v-btn>
            <v-btn outline color="error" @click="setShowQuestionOnCommitment(false, 'requestHideQuestionRunning')"
                   :loading="requestHideQuestionRunning"
                   :disabled="requestShowQuestionRunning || requestHideQuestionRunning">
                <v-icon>mdi-clear</v-icon>
                {{$t('common:button.no')}}
            </v-btn>
        </div>
        <div class="info-post-action" v-else>
            <div v-if="uploaded === 'requestShowQuestionRunning'">
                {{$t('pages:notifications.showQuestionRequest.postNotificationAccepted1')}}
                <span class="bold" @click="$router.push({name: 'question-questionId-slug',
                     params: {questionId: notification.questionId, slug: notification.questionSlug}})">
                {{notification.question}}</span>
                {{$t('pages:notifications.showQuestionRequest.postNotificationAccepted2')}}
                <span class="bold" @click="$router.push({name: 'commitment-commitmentId-slug',
                     params: {commitmentId: notification.commitmentId, slug: notification.commitmentSlug}})">
                {{notification.commitmentTitle}}</span>
                {{$t('pages:notifications.showQuestionRequest.postNotificationAccepted3')}}
            </div>
            <div v-else="uploaded === 'requestHideQuestionRunning'">
                {{$t('pages:notifications.showQuestionRequest.postNotificationDeny1')}}
                <span class="bold" @click="$router.push({name: 'question-questionId-slug',
                     params: {questionId: notification.questionId, slug: notification.questionSlug}})">
                {{notification.question}}</span>
                {{$t('pages:notifications.showQuestionRequest.postNotificationDeny2')}}
                <span class="bold" @click="$router.push({name: 'commitment-commitmentId-slug',
                     params: {commitmentId: notification.commitmentId, slug: notification.commitmentSlug}})">
                {{notification.commitmentTitle}}</span>
                {{$t('pages:notifications.showQuestionRequest.postNotificationDeny3')}}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ShowQuestionRequest",
        props: ['notification'],
        data() {
            return {requestShowQuestionRunning: false, requestHideQuestionRunning: false, uploaded: ''}
        },
        methods: {
            async setShowQuestionOnCommitment(showQuestion, requestRunning) {
                try {
                    this[requestRunning] = true;
                    await this.$axios.$put(`user/commitment/showQuestionRequest/${this.notification.commitmentId}`,
                        {questionId: this.notification.questionId, showQuestion: showQuestion});
                    this.$store.commit('notification/REMOVE_NOTIFICATION', this.notification);
                    this[requestRunning] = false;
                    this.uploaded = requestRunning;
                } catch (error) {
                    this[requestRunning] = false;
                }
            }
        },
    }
</script>

<style lang="scss">
    .notification-show-question-request {
        font-weight: 300;
        .notification-title {
            .bold {
                font-weight: 400;
                cursor: pointer;
                color: $primary-color;
            }
            :hover.bold {
                text-decoration: underline;
            }
        }
        .commands-container {
            margin-top: 6px;
            button {
                margin-left: 0;
                margin-right: 16px;
            }
        }
        .info-post-action {
            .bold {
                font-weight: 400;
                cursor: pointer;
                color: $primary-color;
            }
            :hover.bold {
                text-decoration: underline;
            }
        }
    }
</style>