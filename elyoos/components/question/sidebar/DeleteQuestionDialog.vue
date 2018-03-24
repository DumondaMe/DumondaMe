<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="300px">
            <v-card id="dialog-delete-question">
                <v-card-title>
                    {{$t("pages:detailQuestion.sidebar.deleteQuestion.title")}}
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text id="dialog-delete-question-content">
                    <p>{{$t("pages:detailQuestion.sidebar.deleteQuestion.description", {question})}}</p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click.native="$emit('close-dialog')" :disabled="running">
                        {{$t("common:button.abort")}}
                    </v-btn>
                    <v-btn color="primary" @click.native="deleteQuestion()"
                           :loading="running" :disabled="running">
                        {{$t("pages:detailQuestion.sidebar.deleteQuestion.confirmButton")}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    export default {
        data() {
            return {dialog: true, running: false}
        },
        computed: {
            question() {
                return this.$store.state.question.question.question;
            }
        },
        methods: {
            async deleteQuestion() {
                try {
                    this.running = true;
                    await this.$store.dispatch('question/deleteQuestion');
                    this.$emit('delete-question');
                } catch (error) {
                    this.running = false;
                }
            }
        },
    }
</script>

<style lang="scss">
    #dialog-login-required {
        max-width: 250px;
        #dialog-login-required-content {
            max-width: 250px;
            p {
                font-size: 16px;
                font-weight: 300;
            }
            .link-button {
                width: 100%;
                margin: 6px 0 6px 0;
            }
        }
    }
</style>
