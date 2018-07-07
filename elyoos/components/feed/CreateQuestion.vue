<template>
    <div class="feed-create-question-container">
        <v-btn color="primary" outline @click="openCreateQuestionDialog()">
            {{$t('common:button.askQuestion')}}
        </v-btn>
        <create-question-dialog v-if="showCreateQuestionDialog" @close-dialog="showCreateQuestionDialog = false">
        </create-question-dialog>
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
    </div>
</template>

<script>
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired';
    import CreateQuestionDialog from '~/components/question/dialog/CreateQuestionDialog.vue'

    export default {
        components: {CreateQuestionDialog, LoginRequiredDialog},
        data() {
            return {showCreateQuestionDialog: false, showLoginRequired: false}
        },
        methods: {
            openCreateQuestionDialog() {
                if (this.$store.state.auth.userIsAuthenticated) {
                    this.showCreateQuestionDialog = true
                } else {
                    this.showLoginRequired = true;
                }
            }
        }
    }
</script>

<style lang="scss">
    .feed-create-question-container {
        margin-bottom: 18px;
        button {
            margin-top: 0;
            margin-left: 0;
        }
    }
</style>