<template>
    <div class="feed-create-question-container">
        <v-menu bottom offset-y>
            <v-btn color="secondary" slot="activator">
                {{$t('pages:feeds.createContribution.button')}}
                <v-icon right>mdi-menu-down</v-icon>
            </v-btn>
            <v-list>
                <v-list-tile @click="openCreateDialog('showCreateQuestionDialog')">
                    <v-list-tile-title>{{$t('common:question')}}</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="openCreateDialog('showCreateCommitmentDialog')">
                    <v-list-tile-title>{{$t("common:commitment")}}</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
        <create-commitment-dialog v-if="showCreateCommitmentDialog" @close-dialog="showCreateCommitmentDialog = false">
        </create-commitment-dialog>
        <create-question-dialog v-if="showCreateQuestionDialog" @close-dialog="showCreateQuestionDialog = false">
        </create-question-dialog>
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
    </div>
</template>

<script>
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired';
    import CreateQuestionDialog from '~/components/question/dialog/CreateQuestionDialog.vue'
    import CreateCommitmentDialog from '~/components/commitment/dialog/CreateDialog.vue'

    export default {
        components: {CreateQuestionDialog, CreateCommitmentDialog, LoginRequiredDialog},
        data() {
            return {showCreateQuestionDialog: false, showCreateCommitmentDialog: false, showLoginRequired: false}
        },
        methods: {
            openCreateDialog(dialogName) {
                if (this.$store.state.auth.userIsAuthenticated) {
                    this[dialogName] = true
                } else {
                    this.showLoginRequired = true;
                }
            }
        }
    }
</script>

<style lang="scss">
    .feed-create-question-container {
        margin-top: 4px;
        margin-bottom: 62px;
        h3.feed-desktop-sidebar-title {
            margin-bottom: 12px;
        }
        .open-create-question-dialog {
            cursor: pointer;
            font-size: 14px;
            font-weight: 400;
            color: $primary-color;
        }
        :hover.open-create-question-dialog {
            text-decoration: underline;
        }
        button {
            margin: 0;
        }
    }
</style>