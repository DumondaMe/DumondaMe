<template>
    <div id="elyoos-question-header">
        <h1>{{question.question}}</h1>
        <user-info :name="question.creator.name" :thumbnail-url="question.creator.thumbnailUrl"
                   :created="question.created">
        </user-info>
        <p id="question-description">{{question.description}}</p>
        <div id="question-commands">
            <v-btn outline color="primary" id="answer-question-button" @click="openCreateAnswerDialog()"
                   slot="activator">
                {{$t("common:button.answer")}}
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
            }

        },
    }
</script>

<style lang="scss">
    #elyoos-question-header {
        margin-bottom: 48px;
        h1 {
            margin-bottom: 8px;
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
