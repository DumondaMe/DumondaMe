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
                        <v-btn small fab color="secondary" class="first-button" slot="activator"
                               :disabled="!suggestion.creator.isLoggedInUser">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-list>
                            <v-list-tile @click="showEditSuggestionDialog = true">
                                <v-list-tile-title>{{$t("common:button.edit")}}</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="showDeleteSuggestionDialog = true">
                                <v-list-tile-title>{{$t("common:button.delete")}}</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>
                    <v-tooltip bottom>
                        <v-btn small fab color="secondary" slot="activator">
                            <v-icon>mdi-magnify-plus</v-icon>
                        </v-btn>
                        <span>{{$t('pages:detailQuestion.menu.suggestion.tooltipDetailView')}}</span>
                    </v-tooltip>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['suggestion', 'isAdmin'],
        components: {},
        data() {
            return {
                showError: false, showEditSuggestionDialog: false, showDeleteSuggestionDialog: false
            }
        },
        methods: {}
    }
</script>

<style lang="scss">
    .suggestion-question {
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
            .suggestion-title {

            }
            .suggestion-text {
                font-style: italic;
            }
        }
        .suggestion-commands {
            margin-top: 8px;
            display: flex;
            .first-button {
                margin-left: 0;
            }
        }
    }
</style>