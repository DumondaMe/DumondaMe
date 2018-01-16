<template>
    <div>
        <div id="question-activity">
            <span id="question-text" @click="dialog = true">{{$t("pages:feeds.question.yourQuestion")}}</span>
        </div>
        <v-layout row justify-center>
            <v-dialog v-model="dialog" scrollable max-width="500px">
                <v-card>
                    <v-card-text>
                        <div id="ask-question-container">
                            <v-text-field type="text" v-model="question" name="question"
                                          :label="$t('pages:feeds.question.yourQuestion')"
                                          :counter="140">
                            </v-text-field>
                            <div class="dialog-login-info">
                                {{$t("pages:feeds.question.createQuestionInfo")}}
                            </div>
                        </div>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" flat @click.native="dialog = false">{{$t("common:button.close")}}</v-btn>
                        <v-btn color="primary" flat @click.native="dialog = false"
                               :disabled="!isAuthenticated">{{$t("common:button.create")}}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </div>
</template>

<script>
    import debounce from 'debounce';

    export default {
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
        data: function () {
            return {dialog: false, question: '', tests: []};
        },
        watch: {
            question: debounce(function (newQuestion) {

            }, 500)
        }
    }
</script>

<style lang="scss">
    #question-activity {
        background-color: white;
        border-radius: 4px;
        border: 1px solid #e0e0e0;
        padding: 12px;
        margin: 0;
        #question-text {
            font-weight: 500;
            font-size: 18px;
            color: #999;
            cursor: pointer;
        }
        :hover#question-text {
            color: $primary-color;
        }
    }

    #ask-question-container {
        padding-top: 6px;
        padding-left: 12px;
        padding-right: 12px;
        .dialog-login-info {
            margin: 24px 0;
            font-size: 14px;
            color: $secondary-text;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
            padding: 8px;
        }
    }
</style>
