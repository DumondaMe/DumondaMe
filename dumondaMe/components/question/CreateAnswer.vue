<template>
    <div>
        <div id="create-answer-container">
            <v-spacer></v-spacer>
            <v-btn color="secondary" id="answer-question-button" @click="openCreateAnswerDialog()">
                <v-icon left>$vuetify.icons.mdiPlus</v-icon>
                {{$t('common:button.answerQuestion')}}
            </v-btn>
        </div>
        <v-layout row justify-center v-if="showCreateDialog">
            <v-dialog v-model="showCreateDialog" scrollable persistent max-width="770px"
                      :fullscreen="$vuetify.breakpoint.xsOnly">
                <create-dialog @close-dialog="showCreateDialog = false">
                </create-dialog>
            </v-dialog>
        </v-layout>

        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
    </div>
</template>

<script>
    import CreateDialog from '~/components/question/answer/dialog/CreateDialog.vue';
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired.vue';

    export default {
        components: {CreateDialog, LoginRequiredDialog},
        data() {
            return {showCreateDialog: false, showLoginRequired: false}
        },
        methods: {
            openCreateAnswerDialog() {
                if (this.$store.state.auth.userIsAuthenticated) {
                    this.showCreateDialog = true;
                } else {
                    this.showLoginRequired = true;
                }
            }
        }
    }
</script>

<style lang="scss">
    #create-answer-container {
        margin-bottom: 42px;
        display: flex;
        #answer-question-button {
            margin-top: 8px;
            margin-right: 0;
        }
    }
</style>
