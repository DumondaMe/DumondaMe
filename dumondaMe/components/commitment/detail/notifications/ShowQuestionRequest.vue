<template>
    <div class="commitment-notification-show-question-request">
        <div class="notification-created">{{notification.created | formatRelativeTimesAgo}}</div>
        <div class="notification-title">
            {{$t('pages:detailCommitment.notifications.showQuestionRequest.notification1')}}
            <span class="bold" @click="$router.push({name: 'question-questionId-slug',
                     params: {questionId: notification.questionId, slug: notification.questionSlug}})">
                {{notification.question}}</span>
            {{$t('pages:detailCommitment.notifications.showQuestionRequest.notification2')}}
        </div>
        <div class="commands-container">
            <v-btn outlined color="success" @click="setShowQuestionOnCommitment(true, 'requestShowQuestionRunning')"
                   :loading="requestShowQuestionRunning"
                   :disabled="requestShowQuestionRunning || requestHideQuestionRunning">
                <v-icon>mdi-check</v-icon>
                {{$t('common:button.yes')}}
            </v-btn>
            <v-btn outlined color="error" @click="setShowQuestionOnCommitment(false, 'requestHideQuestionRunning')"
                   :loading="requestHideQuestionRunning"
                   :disabled="requestShowQuestionRunning || requestHideQuestionRunning">
                <v-icon>mdi-clear</v-icon>
                {{$t('common:button.no')}}
            </v-btn>
        </div>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    export default {
        name: "ShowQuestionRequest",
        props: ['notification'],
        data() {
            return {
                requestShowQuestionRunning: false, requestHideQuestionRunning: false, uploaded: '',
                showError: false
            }
        },
        methods: {
            async setShowQuestionOnCommitment(showQuestion, requestRunning) {
                try {
                    this[requestRunning] = true;
                    let response = await this.$axios.$put(`user/commitment/showQuestionRequest/${this.notification.commitmentId}`,
                        {questionId: this.notification.questionId, showQuestion: showQuestion});
                    response.questionId = this.notification.questionId;
                    this.$store.commit('notification/REMOVE_NOTIFICATION', this.notification);
                    if (response.question) {
                        this.$store.commit('commitment/ADD_QUESTION', response);
                    }
                    this[requestRunning] = false;
                    this.uploaded = requestRunning;
                } catch (error) {
                    this[requestRunning] = false;
                    this.showError = true;
                }
            }
        }
    }
</script>

<style lang="scss">
    .commitment-notification-show-question-request {
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
    }
</style>