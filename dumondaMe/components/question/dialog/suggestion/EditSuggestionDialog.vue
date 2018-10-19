<template>
    <div>
        <v-layout row justify-center>
            <v-dialog v-model="dialog" scrollable persistent max-width="650px" :fullscreen="$vuetify.breakpoint.xsOnly">
                <suggestion :init-suggestion="initSuggestion" :is-edit-mode="false" :loading="loading"
                            :action-button-text="$t('common:button.edit')"
                            @close-dialog="$emit('close-dialog')" @finish="editSuggestion">
                    <div slot="header">
                        <div id="dumonda-me-dialog-header">
                            {{$t('pages:detailQuestion.suggestionDialog.title')}}
                        </div>
                        <v-divider></v-divider>
                    </div>
                </suggestion>
            </v-dialog>
        </v-layout>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import Suggestion from './Suggestion';

    export default {
        props: ['initSuggestion'],
        data() {
            return {dialog: true, loading: false, showError: false}
        },
        components: {Suggestion},
        methods: {
            async editSuggestion(suggestion) {
                try {
                    let editSuggestion = {suggestionId: this.initSuggestion.suggestionId};
                    if (suggestion.title && suggestion.title.trim() !== '') {
                        editSuggestion.title = suggestion.title;
                    }
                    if (suggestion.description && suggestion.description.trim() !== '') {
                        editSuggestion.description = suggestion.description;
                    }
                    if (suggestion.explanation && suggestion.explanation.trim() !== '') {
                        editSuggestion.explanation = suggestion.explanation;
                    }
                    this.loading = true;
                    await this.$axios.$put(`superUser/question/suggestion`, editSuggestion);
                    this.$emit('finish', editSuggestion);
                }
                catch (e) {
                    this.showError = true;
                } finally {
                    this.loading = false;
                }
            }
        }
    }
</script>

<style lang="scss">

</style>
