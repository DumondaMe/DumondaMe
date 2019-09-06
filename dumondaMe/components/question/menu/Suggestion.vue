<template>
    <div>
        <div class="suggestion-question">
            <div class="user-image">
                <img :src="suggestion.creator.userImage">
            </div>
            <div>
                <div class="status-is-open" v-if="suggestion.open">
                    {{$t('pages:detailQuestion.menu.suggestion.statusOpen')}}
                </div>
                <div class="status-is-open" v-else>
                    {{$t('pages:detailQuestion.menu.suggestion.statusClosed')}}
                </div>
                <div class="user-action-description">
                    <div v-if="suggestion.creator.isLoggedInUser">
                        <span class="creator-name">{{$t('common:you')}}</span>
                        {{$t('pages:detailQuestion.menu.suggestion.loggedInUserSuggestion')}}
                    </div>
                    <div v-else>
                        <span class="creator-name">{{suggestion.creator.name}}</span>
                        {{$t('pages:detailQuestion.menu.suggestion.userSuggestion')}}
                    </div>
                </div>
                <div class="suggestion-created">{{suggestion.created | formatRelativeTimesAgo}}</div>
                <div v-if="suggestion.title" class="suggestion-element">
                    <div class="suggestion-title">
                        {{$t('pages:detailQuestion.suggestionDialog.question')}}:
                    </div>
                    <div class="suggestion-text">{{suggestion.title}}</div>
                </div>
                <div v-if="suggestion.description" class="suggestion-element">
                    <div class="suggestion-title">
                        {{$t('pages:detailQuestion.suggestionDialog.description')}}:
                    </div>
                    <div class="suggestion-text">{{suggestion.description}}</div>
                </div>
                <div v-if="suggestion.explanation" class="suggestion-element">
                    <div class="suggestion-title">
                        {{$t('pages:detailQuestion.suggestionDialog.explanation')}}:
                    </div>
                    <div class="suggestion-text">{{suggestion.explanation}}</div>
                </div>
                <div class="suggestion-commands">
                    <v-menu bottom left offset-y v-if="suggestion.creator.isLoggedInUser">
                        <template v-slot:activator="{ on }">
                            <v-btn small fab color="secondary" class="first-button" v-on="on"
                                   :disabled="!suggestion.creator.isLoggedInUser">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item @click="showEditSuggestionDialog = true">
                                <v-list-item-title>{{$t("common:button.edit")}}</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="showDeleteSuggestionDialog = true">
                                <v-list-item-title>{{$t("common:button.delete")}}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn small fab color="secondary" v-on="on">
                                <v-icon>mdi-magnify-plus</v-icon>
                            </v-btn>
                        </template>
                        <span>{{$t('pages:detailQuestion.menu.suggestion.tooltipDetailView')}}</span>
                    </v-tooltip>
                </div>
            </div>
        </div>
        <edit-suggestion-dialog v-if="showEditSuggestionDialog" @close-dialog="showEditSuggestionDialog = false"
                                @finish="editSuggestion" :init-suggestion="suggestion">
        </edit-suggestion-dialog>
        <delete-suggestion-dialog v-if="showDeleteSuggestionDialog" @close-dialog="showDeleteSuggestionDialog = false"
                                  @delete-suggestion="deleteSuggestion" :suggestion-id="suggestion.suggestionId">
        </delete-suggestion-dialog>
    </div>
</template>

<script>
    import EditSuggestionDialog from '../dialog/suggestion/EditSuggestionDialog';
    import DeleteSuggestionDialog from '../dialog/suggestion/DeleteSuggestionDialog';

    export default {
        props: ['suggestion', 'isAdmin'],
        components: {EditSuggestionDialog, DeleteSuggestionDialog},
        data() {
            return {
                showError: false, showEditSuggestionDialog: false, showDeleteSuggestionDialog: false
            }
        },
        methods: {
            editSuggestion(suggestion) {
                this.showEditSuggestionDialog = false;
                this.suggestion.title = suggestion.title;
                this.suggestion.description = suggestion.description;
                this.suggestion.explanation = suggestion.explanation;
                this.$emit('add-suggestion');
            },
            deleteSuggestion() {
                this.$emit('delete-suggestion', this.suggestion.suggestionId);
                this.showDeleteSuggestionDialog = false;
            }
        }
    }
</script>

<style lang="scss">
    .suggestion-question {
        margin-bottom: 26px;
        display: flex;

        .user-image {
            margin-right: 12px;

            img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
            }
        }

        .status-is-open {
            font-size: 12px;
            line-height: 14px;
            color: $success-text;
        }

        .user-action-description {
            font-size: 14px;
            font-weight: 500;

            .creator-name {
                cursor: pointer;
                color: $primary-color;
            }

            :hover.creator-name {
                text-decoration: underline;
            }
        }

        .suggestion-created {
            font-size: 12px;
            color: $secondary-text;
            margin-bottom: 8px;
        }

        .suggestion-element {
            font-size: 14px;
            margin-bottom: 12px;

            .suggestion-title {

            }

            .suggestion-text {
                font-style: italic;
            }
        }

        .suggestion-commands {
            display: flex;

            .first-button {
                margin-left: 0;
            }
        }
    }
</style>