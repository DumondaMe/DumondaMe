<template>
    <v-card id="note-container">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text>
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
                   :disabled="!valid || loading">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';

    export default {
        props: ['actionButtonText', 'loading'],
        data: function () {
            return {noteText: '', valid: false};
        },
        mixins: [validationRules]
    }
</script>

<style lang="scss">
    #note-container {

    }
</style>
