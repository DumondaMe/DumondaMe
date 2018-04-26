<template>
    <div id="elyoos-question-header">
        <h1 itemprop="name">{{question.question}}</h1>
        <p id="question-description" itemprop="text">{{question.description}}</p>
        <div id="question-commands">
            <v-btn color="primary" id="answer-question-button" @click="openCreateAnswerDialog()">
                {{$t("common:button.answer")}}
            </v-btn>

            <v-btn color="primary" outline class="watch-question-button" @click="addWatch()"
                   v-if="!question.userWatchesQuestion" :disabled="question.isAdmin">
                <v-icon>mdi-eye</v-icon>
                {{$t("common:button.watch")}}
            </v-btn>
            <v-btn color="primary" outline class="watch-question-button" @click="removeWatch()" v-else>
                <v-icon>mdi-eye-off</v-icon>
                {{$t("common:button.watch")}}
            </v-btn>
        </div>

        <v-layout row justify-center>
            <v-dialog v-model="dialog" scrollable persistent max-width="770px">
                <create-dialog @close-dialog="dialog = false" v-if="dialog">
                </create-dialog>
            </v-dialog>
        </v-layout>

        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
    </div>
</template>

<script>
    import UserInfo from '~/components/common/user/Info.vue';
    import CreateDialog from '~/components/question/answer/dialog/CreateDialog.vue';
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired.vue';

    export default {
        components: {UserInfo, CreateDialog, LoginRequiredDialog},
        data() {
            return {dialog: false, showLoginRequired: false}
        },
        computed: {
            question() {
                return this.$store.state.question.question;
            }
        },
        methods: {
            openCreateAnswerDialog() {
                if (this.$store.state.auth.userIsAuthenticated) {
                    this.dialog = true;
                } else {
                    this.showLoginRequired = true;
                }
            },
            async addWatch() {
                if (this.$store.state.auth.userIsAuthenticated) {
                    await this.$axios.$put(`user/question/watch/${this.question.questionId}`);
                    this.$store.commit('question/SET_WATCH')
                } else {
                    this.showLoginRequired = true;
                }
            },
            async removeWatch() {
                if (this.$store.state.auth.userIsAuthenticated) {
                    await this.$axios.$delete(`user/question/watch`,
                        {params: {questionId: this.question.questionId}});
                    this.$store.commit('question/REMOVE_WATCH')
                } else {
                    this.showLoginRequired = true;
                }
            }
        },
    }
</script>

<style lang="scss">
    #elyoos-question-header {
        margin-bottom: 48px;
        h1 {
            margin-bottom: 4px;
            font-size: 28px;
        }
        #question-description {
            margin-top: 12px;
            font-size: 16px;
            font-weight: 300;
        }
        #question-commands {
            #answer-question-button {
                margin-left: 0;
            }
            .material-icons {
                margin-right: 8px;
            }
        }
    }
</style>
