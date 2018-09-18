<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="300px">
            <v-card id="dialog-delete-question">
                <div id="elyoos-dialog-header">
                    {{$t("pages:detailQuestion.deleteDialogSuggestion.title")}}
                </div>
                <v-divider></v-divider>
                <v-card-text id="dialog-delete-question-content">
                    <p>{{$t("pages:detailQuestion.deleteDialogSuggestion.description")}}</p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click.native="$emit('close-dialog')" :disabled="running">
                        {{$t("common:button.abort")}}
                    </v-btn>
                    <v-btn color="primary" @click.native="deleteQuestion()"
                           :loading="running" :disabled="running">
                        {{$t("pages:detailQuestion.deleteDialogSuggestion.confirmButton")}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    export default {
        props: ['suggestionId'],
        data() {
            return {dialog: true, running: false, showError: false}
        },
        methods: {
            async deleteQuestion() {
                try {
                    this.running = true;
                    await this.$axios.$delete(`superUser/question/suggestion`,
                        {params: {suggestionId: this.suggestionId}});
                    this.$emit('delete-suggestion');
                }
                catch (e) {
                    this.showError = true;
                } finally {
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
