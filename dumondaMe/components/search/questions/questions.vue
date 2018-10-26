<template>
    <div id="search-questions-container">
        <h2 class="questions-profile-title">{{$t("pages:search.questions.title")}}</h2>
        <div class="question-container ely-card feed-card" v-for="question of questions">
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
        <v-btn color="primary" @click="openCreateDialog">
            {{$t('pages:search.questions.createNewQuestion')}}
        </v-btn>
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
            return {showCreateQuestionDialog: false, showLoginRequired: false}
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
            }
        },
        computed: {
            questions() {
                return this.$store.state.search.questions;
            }
        },
    }
</script>

<style lang="scss">
    #search-questions-container {
        margin-bottom: 38px;
        .questions-profile-title {
            font-size: 22px;
            margin-bottom: 18px;
        }
        button {
            margin-left: 0;
        }
    }
</style>
