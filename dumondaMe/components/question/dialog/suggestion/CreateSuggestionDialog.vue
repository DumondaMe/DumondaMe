<template>
    <div>
        <v-layout row justify-center>
            <v-dialog v-model="dialog" scrollable persistent max-width="650px">
                <suggestion :init-suggestion="{}" :is-edit-mode="false" :loading="loading"
                            :action-button-text="$t('pages:detailQuestion.menu.suggestion.addButton')"
                            @close-dialog="$emit('close-dialog')" @finish="createSuggestion">
                    <div slot="header">
                        <div id="elyoos-dialog-header">
                            {{$t('pages:detailQuestion.suggestionDialog.title')}}
                        </div>
                        <v-divider></v-divider>
                    </div>
                    <div slot="description">
                        {{$t('pages:detailQuestion.suggestionDialog.descriptionSuggestion')}}
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
        props: ['questionId'],
        data() {
            return {dialog: true, loading: false, showError: false}
        },
        components: {Suggestion},
        methods: {
            async createSuggestion(suggestion) {
                try {
                    let newSuggestion = {questionId: this.questionId};
                    if (suggestion.title && suggestion.title.trim() !== '') {
                        newSuggestion.title = suggestion.title;
                    }
                    if (suggestion.description && suggestion.description.trim() !== '') {
                        newSuggestion.description = suggestion.description;
                    }
                    if (suggestion.explanation && suggestion.explanation.trim() !== '') {
                        newSuggestion.explanation = suggestion.explanation;
                    }
                    this.loading = true;
                    let response = await this.$axios.$post(`superUser/question/suggestion`, newSuggestion);
                    newSuggestion.suggestionId = response.suggestionId;
                    newSuggestion.created = response.created;
                    newSuggestion.creator = response.creator;
                    this.$emit('finish', newSuggestion);
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
