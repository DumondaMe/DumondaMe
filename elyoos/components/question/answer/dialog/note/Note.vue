<template>
    <v-card id="note-container">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text>
            <slot name="description"></slot>
            <v-form v-model="valid">
                <v-text-field type="text" v-model="noteText" name="note"
                              :label="$t('pages:detailQuestion.note.createNoteDialog.text')"
                              :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                       ruleToManyChars($t('validation:toManyChars'), 240)]"
                              :counter="240">
                </v-text-field>
            </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat :disabled="loading"
                   @click.native="$emit('close-dialog')">{{$t("common:button.abort")}}
            </v-btn>
            <v-btn color="primary" @click.native="$emit('finish', noteText)" :loading="loading"
                   :disabled="!valid || loading || hasNotChanged">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';

    export default {
        props: ['actionButtonText', 'loading', 'initNoteText'],
        data: function () {
            return {noteText: this.initNoteText, valid: false};
        },
        computed: {
            hasNotChanged() {
                return this.initNoteText === this.noteText;
            }
        },
        mixins: [validationRules]
    }
</script>

<style lang="scss">
    #note-container {
        .note-description {
            margin-bottom: 12px;
        }
    }
</style>
