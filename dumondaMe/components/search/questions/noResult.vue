<template>
    <div id="search-questions-no-result-container">
        <h2 class="user-profile-title">{{$t("pages:search.questions.title")}}</h2>
        <div class="no-user-description">{{$t("pages:search.questions.noQuestionDescription")}}</div>
        <v-btn color="primary" @click="openCreateQuestionDialog">
            {{$t('pages:search.questions.createNewQuestion')}}
        </v-btn>
        <create-question-dialog v-if="showCreateQuestionDialog" @close-dialog="showCreateQuestionDialog = false">
        </create-question-dialog>
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
    </div>
</template>

<script>
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired';
    import CreateQuestionDialog from '~/components/question/dialog/CreateQuestionDialog.vue';

    export default {
        data() {
            return {showCreateQuestionDialog: false, showLoginRequired: false}
        },
        components: {LoginRequiredDialog, CreateQuestionDialog},
        methods: {
            openCreateQuestionDialog() {
                if (this.isAuthenticated) {
                    this.showCreateQuestionDialog = true;
                } else {
                    this.showLoginRequired = true;
                }
            }
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        }
    }
</script>

<style lang="scss">
    #search-questions-no-result-container {
        margin-bottom: 38px;

        h2 {
            font-size: 22px;
            margin-bottom: 12px;
        }
        button {
            margin-left: 0;
            margin-top: 12px;
        }
    }
</style>
