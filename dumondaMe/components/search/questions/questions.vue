<template>
    <div id="search-questions-container">
        <h2 class="questions-profile-title">{{$t("pages:search.questions.title")}}</h2>
        <div class="question-container ely-card feed-card" v-for="(question, index) of questions"
             :class="{'last-card-element': index === questions.length - 1}">
            <question-card :question="question" :hide-time="true">
                <question-card-footer slot="footer" :user="question.user"
                                      :number-of-watches="question.numberOfWatches"
                                      :number-of-answers="question.numberOfAnswers"
                                      :question-id="question.questionId" :question-slug="question.slug"
                                      :is-watched-by-user="question.isWatchedByUser" :is-admin="question.isAdmin"
                                      @add-watch="addQuestionWatch" @remove-watch="removeQuestionWatch"
                                      @add-trust-circle="(userId) => addUserToTrustCircle(userId)"
                                      @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                </question-card-footer>
            </question-card>
        </div>
        <div class="search-questions-commands">
            <v-btn outlined color="primary" v-if="hasMoreQuestions" class="has-more-button" @click="getNextQuestions"
                   :loading="loadingNextQuestions" :disabled="loadingNextQuestions">
                {{$t('common:button.showMore')}}
            </v-btn>
            <v-btn color="primary" @click="openCreateDialog" class="create-question-button">
                {{$t('pages:search.questions.createNewQuestion')}}
            </v-btn>
        </div>
        <create-question-dialog v-if="showCreateQuestionDialog" @close-dialog="showCreateQuestionDialog = false">
        </create-question-dialog>
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
    </div>
</template>

<script>
    import QuestionCard from '~/components/feed/card/Question';
    import QuestionCardFooter from '~/components/feed/card/footer/Question';
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired';
    import CreateQuestionDialog from '~/components/question/dialog/CreateQuestionDialog.vue'

    export default {
        data() {
            return {showCreateQuestionDialog: false, showLoginRequired: false, loadingNextQuestions: false}
        },
        components: {QuestionCard, QuestionCardFooter, LoginRequiredDialog, CreateQuestionDialog},
        methods: {
            addQuestionWatch(questionId) {
                this.$store.commit('search/ADD_QUESTION_WATCH', questionId);
            },
            removeQuestionWatch(questionId) {
                this.$store.commit('search/REMOVE_QUESTION_WATCH', questionId);
            },
            async addUserToTrustCircle(userId) {
                this.$store.commit('search/ADD_USER_TO_TRUST_CIRCLE', userId);
            },
            async removeUserFromTrustCircle(userId) {
                this.$store.commit('search/REMOVE_USER_FROM_TRUST_CIRCLE', userId);
            },
            openCreateDialog() {
                if (this.$store.state.auth.userIsAuthenticated) {
                    this.showCreateQuestionDialog = true
                } else {
                    this.showLoginRequired = true;
                }
            },
            async getNextQuestions() {
                try {
                    this.loadingNextQuestions = true;
                    await this.$store.dispatch('search/searchNextQuestions');
                } catch (error) {
                    this.showError = true;
                } finally {
                    this.loadingNextQuestions = false;
                }
            }
        },
        computed: {
            questions() {
                return this.$store.state.search.questions;
            },
            hasMoreQuestions() {
                return this.$store.state.search.hasMoreQuestions;
            }
        },
    }
</script>

<style lang="scss">
    #search-questions-container {
        margin-bottom: 38px;
        @media screen and (max-width: $xs) {
            padding-bottom: 12px;
            margin-bottom: 20px;
            border-bottom: 1px solid $divider;
        }
        .questions-profile-title {
            font-size: 22px;
            margin-bottom: 18px;
            @media screen and (max-width: $xs) {
                display: none;
            }
        }
        .question-container {
            @media screen and (max-width: $xs) {
                padding-bottom: 8px;
            }
        }
        .question-container.last-card-element {
            @media screen and (max-width: $xs) {
                border-bottom: none;
            }
        }
        .search-questions-commands {
            margin-top: 12px;
            display: flex;
            .has-more-button {
                margin-left: 0;
                margin-right: 16px;
                @media screen and (max-width: $xs) {
                    margin-left: 16px;
                    margin-right: 0;
                }
            }
            .create-question-button {
                margin-left: 0;
                @media screen and (max-width: $xs) {
                    margin-left: 16px;
                }
            }
        }
    }
</style>
