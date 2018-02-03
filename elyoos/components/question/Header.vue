<template>
    <div id="elyoos-question-header">
        <h1>{{question.question}}</h1>
        <user-info :name="question.creator.name" :thumbnail-url="question.creator.thumbnailUrl"
                   :created="question.created">
        </user-info>
        <p id="question-description">{{question.description}}</p>
        <div id="question-commands">
            <v-btn outline color="primary" id="answer-question-button" @click="dialog = true"
                   :disabled="!isAuthenticated" slot="activator">
                {{$t("common:button.answer")}}
            </v-btn>
        </div>

        <v-layout row justify-center>
            <v-dialog v-model="dialog" scrollable persistent max-width="770px">
                <create-dialog @close-dialog="dialog = false" v-if="dialog">
                </create-dialog>
            </v-dialog>
        </v-layout>
    </div>
</template>

<script>
    import UserInfo from '~/components/common/user/Info.vue';
    import CreateDialog from '~/components/question/answer/dialog/CreateDialog.vue';

    export default {
        components: {UserInfo, CreateDialog},
        data() {
            return {dialog: false}
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            question() {
                return this.$store.state.question.question;
            }
        }
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
