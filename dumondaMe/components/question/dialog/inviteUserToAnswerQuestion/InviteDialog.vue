<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <v-card id="dialog-invite-user-to-answer-question">
                <div id="dumonda-me-dialog-header">
                    {{$t("pages:question.askUserAnswerQuestion.title")}}
                </div>
                <v-divider></v-divider>
                <v-card-text id="dialog-invite-user-to-answer-question-content" class="mobile-dialog-content">
                    <v-text-field type="text" v-model="search" name="search"
                                  :label="$t('pages:question.askUserAnswerQuestion.inviteDialog.searchLabel')">
                    </v-text-field>
                    <p>{{$t("pages:question.askUserAnswerQuestion.inviteDialog.description")}}</p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click.native="$emit('close-dialog')" :disabled="running">
                        {{$t("common:button.abort")}}
                    </v-btn>
                    <v-btn color="primary" @click.native="sendInvitation()"
                           :loading="running" :disabled="running">
                        {{$t("common:button.sent")}}
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
        data() {
            return {dialog: true, search: '', running: false, showError: false}
        },
        computed: {},
        methods: {
            sendInvitation() {

            }
        },
    }
</script>

<style lang="scss">
    #dialog-invite-user-to-answer-question {
        max-width: 650px;

        #dumonda-me-dialog-header {
            max-width: 650px;
        }

        #dialog-invite-user-to-answer-question-content {
            max-width: 650px;
        }
    }
</style>
