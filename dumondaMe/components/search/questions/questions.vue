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
        <v-btn color="secondary">
            {{$t('pages:search.questions.createNewQuestion')}}
        </v-btn>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import QuestionCard from '~/components/feed/card/Question';
    import QuestionCardFooter from '~/components/feed/card/footer/Question';

    export default {
        data() {
            return {loading: false, showError: false}
        },
        components: {QuestionCard, QuestionCardFooter},
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
