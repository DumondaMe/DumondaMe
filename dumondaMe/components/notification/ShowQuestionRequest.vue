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
        <div class="commands-container" v-if="!notification.read">
            <v-btn color="success" @click="setShowQuestionOnCommitment(true, 'requestShowQuestionRunning')"
                   :loading="requestShowQuestionRunning"
                   :disabled="requestShowQuestionRunning || requestHideQuestionRunning">
                <v-icon left>$vuetify.icons.mdiCheck</v-icon>
                {{$t('common:button.yes')}}
            </v-btn>
            <v-btn color="error" @click="setShowQuestionOnCommitment(false, 'requestHideQuestionRunning')"
                   :loading="requestHideQuestionRunning"
                   :disabled="requestShowQuestionRunning || requestHideQuestionRunning">
                <v-icon>{{$icons.mdiClear}}</v-icon>
                {{$t('common:button.no')}}
            </v-btn>
        </div>
        <div class="info-post-action" v-else>
            <div v-if="notification.showQuestion" class="show-question">
                {{$t('pages:notifications.showQuestionRequest.showQuestion')}}
            </div>
            <div v-else class="hide-question">
                {{$t('pages:notifications.showQuestionRequest.notShowQuestion')}}
            </div>
        </div>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark text @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import {mdiClear} from "@mdi/js";

    export default {
        name: "ShowQuestionRequest",
        props: ['notification'],
        data() {
            return {
                requestShowQuestionRunning: false, requestHideQuestionRunning: false, uploaded: '',
                showError: false
            }
        },
        created() {
            this.$icons = {mdiClear}
        },
        methods: {
            async setShowQuestionOnCommitment(showQuestion, requestRunning) {
                try {
                    this[requestRunning] = true;
                    await this.$axios.$put(`user/commitment/showQuestionRequest/${this.notification.commitmentId}`,
                        {questionId: this.notification.questionId, showQuestion});
                    this.$store.commit('notification/SHOW_QUESTION',
                        {notificationSetAsRead: this.notification, showQuestion});
                    this.uploaded = requestRunning;
                } catch (error) {
                    this.showError = true;
                } finally {
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
            margin-top: 12px;

            .show-question {
                color: $success-text;
            }

            .hide-question {
                color: $warning;
            }
        }
    }
</style>