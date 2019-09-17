<template>
    <v-card id="question-suggestion-container">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text>
            <div class="description-suggestion">
                <slot name="description"></slot>
            </div>
            <v-form v-model="valid">
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-text-field type="text" v-model="suggestion.title" name="question"
                                      :label="$t('pages:detailQuestion.suggestionDialog.question')"
                                      :rules="[ruleToManyChars($t('validation:toManyChars'), 140)]"
                                      :counter="140">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-textarea type="text" v-model="suggestion.description" name="description" auto-grow
                                    rows="1"
                                    :label="$t('pages:detailQuestion.suggestionDialog.description')"
                                    :rules="[ruleToManyChars($t('validation:toManyChars'), 2000)]"
                                    :counter="2000">
                        </v-textarea>
                    </v-flex>
                    <v-flex xs12>
                        <v-textarea type="text" v-model="suggestion.explanation" auto-grow
                                    rows="1"
                                    :label="$t('pages:detailQuestion.suggestionDialog.explanation')"
                                    :rules="[ruleToManyChars($t('validation:toManyChars'), 2000)]"
                                    :counter="2000">
                        </v-textarea>
                    </v-flex>
                </v-layout>
            </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text :disabled="loading"
                   @click="$emit('close-dialog')">{{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click="$emit('finish', suggestion)" :loading="loading"
                   :disabled="!valid || loading || !hasChanged || !atLeastOneProperty">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';

    export default {
        props: ['initSuggestion', 'actionButtonText', 'loading', 'isEditMode'],
        data: function () {
            return {
                suggestion: JSON.parse(JSON.stringify(this.initSuggestion)),
                suggestionCompare: JSON.parse(JSON.stringify(this.initSuggestion)), valid: false
            };
        },
        computed: {
            hasChanged() {
                if (this.isEditMode) {
                    return (this.suggestion.title !== this.suggestionCompare.title ||
                        this.suggestion.description !== this.suggestionCompare.description ||
                        this.suggestion.explanation !== this.suggestionCompare.explanation);
                }
                return true;
            },
            atLeastOneProperty() {
                return ((this.suggestion.title && this.suggestion.title.trim() !== '') ||
                    (this.suggestion.description && this.suggestion.description.trim() !== '') ||
                    this.suggestion.explanation && this.suggestion.explanation.trim() !== '')
            }
        },
        mixins: [validationRules]
    }
</script>

<style lang="scss">
    #question-suggestion-container {
        .description-suggestion {
            margin-bottom: 18px;
        }
    }
</style>
