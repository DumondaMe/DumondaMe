<template>
    <v-card id="ask-question-container">
            <v-card-text>
                <v-form v-model="valid">
                    <v-text-field type="text" v-model="question" name="question"
                                  :label="$t('pages:feeds.question.yourQuestion')"
                                  :rules="[ruleToManyChars($t('validation:toManyChars'), 80)]"
                                  :counter="80">
                    </v-text-field>
                </v-form>
                <div class="dialog-login-info" v-if="!isAuthenticated"
                     v-show="question.trim().length < 7">
                    {{$t("pages:feeds.question.createQuestionInfo")}}
                </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat @click.native="$emit('close-dialog')">{{$t("common:button.close")}}</v-btn>
                <v-btn color="primary" flat @click.native="$emit('create-question', question)"
                       :disabled="!isAuthenticated || !isValid">
                    {{$t("pages:feeds.question.buttonNotExist")}}
                </v-btn>
            </v-card-actions>
    </v-card>
</template>

<script>
    import debounce from 'debounce';
    import validationRules from '~/mixins/validationRules.js';

    const MIN_LENGTH_QUESTION = 7;

    export default {
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            isValid() {
                return this.valid && this.question.trim().length >= MIN_LENGTH_QUESTION
            }
        },
        data: function () {
            return {question: '', valid: false};
        },
        mixins: [validationRules],
        watch: {
            question: debounce(function (newQuestion) {
                //Search question
            }, 500)
        }
    }
</script>

<style lang="scss">
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
