<template>
    <div>
        <v-menu v-model="menu" :close-on-content-click="false"
                :close-on-click="closeMenuOnOutsideClick" offset-y>
            <slot name="icon" slot="activator"></slot>
            <v-card class="ely-menu-container ely-menu-suggestion">
                <div class="menu-title">
                    {{$t('pages:detailQuestion.menu.suggestion.title')}}
                </div>
                <div class="menu-content menu-suggestion-content">
                    <div class="no-suggestion" v-if="numberOfSuggestion === 0">
                        {{$t('pages:detailQuestion.menu.suggestion.noSuggestion')}}
                    </div>
                    <div class="suggestion-content-container" v-else-if="suggestions">
                        <suggestion :suggestion="suggestion" :is-admin="isAdmin"
                                    v-for="suggestion of suggestions.suggestions" :key="suggestion.suggestionId"
                                    @delete-suggestion="suggestionDeleted">
                        </suggestion>
                    </div>
                </div>
                <v-divider></v-divider>
                <div class="menu-commands">
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menu = false">{{$t('common:button.close')}}</v-btn>
                    <v-btn color="primary" :disabled="isAdmin" @click="openShowCreateSuggestion()">
                        <v-icon left>mdi-wrench</v-icon>
                        {{$t('pages:detailQuestion.menu.suggestion.addButton')}}
                    </v-btn>
                </div>
            </v-card>
        </v-menu>
        <create-suggestion-dialog v-if="showCreateSuggestion" :question-id="questionId"
                                  @close-dialog="closeShowCreateSuggestion()"
                                  @finish="suggestionCreated">
        </create-suggestion-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import CreateSuggestionDialog from '../dialog/suggestion/CreateSuggestionDialog';
    import Suggestion from './Suggestion';
    import Vue from 'vue';

    export default {
        props: ['numberOfSuggestion', 'isAdmin', 'isSuperUser', 'questionId'],
        components: {CreateSuggestionDialog, Suggestion},
        data() {
            return {
                menu: false, showCreateSuggestion: false, closeMenuOnOutsideClick: true, suggestions: null,
                suggestionLoading: false, showError: false
            }
        },
        methods: {
            openShowCreateSuggestion() {
                this.showCreateSuggestion = true;
                this.closeMenuOnOutsideClick = false;
            },
            closeShowCreateSuggestion() {
                this.showCreateSuggestion = false;
                this.closeMenuOnOutsideClick = true;
            },
            suggestionCreated(suggestion) {
                this.showCreateSuggestion = false;
                this.closeMenuOnOutsideClick = true;
            },
            suggestionDeleted(suggestionId) {
                let indexSuggestion = this.suggestions.suggestions.findIndex(
                    (suggestion) => suggestion.suggestionId === suggestionId);
                if (indexSuggestion > -1) {
                    this.suggestions.suggestions.splice(indexSuggestion, 1);
                }
                this.$emit('delete-suggestion');
            }
        },
        watch: {
            async menu(open) {
                if (open && this.numberOfSuggestion > 0 && this.suggestions === null && !this.suggestionLoading) {
                    try {
                        this.suggestionLoading = true;
                        this.suggestions = await this.$axios.$get('question/suggestion',
                            {params: {questionId: this.questionId, page: 0}});
                        //Workaround to show menu after load of user data on correct position
                        this.menu = false;
                        await Vue.nextTick();
                        this.menu = true;
                    } catch (error) {
                        this.showError = true;
                    } finally {
                        this.suggestionLoading = false;
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    .ely-menu-container.ely-menu-suggestion {
        .menu-suggestion-content {
            .suggestion-content-container {
                max-height: 400px;
                overflow-y: auto;
            }
        }
    }
</style>