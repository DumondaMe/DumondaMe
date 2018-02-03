<template>
    <div class="ely-card text-answer-card">
        <v-layout row class="text-answer-header">
            <user-info :name="answer.creator.name" :thumbnail-url="answer.creator.thumbnailUrl"
                       :isAdmin="answer.isAdmin" :created="answer.created"
                       :answer-type="$t('pages:detailQuestion.answerType.text')">
            </user-info>
            <v-spacer></v-spacer>
            <v-menu bottom v-if="answer.isAdmin">
                <v-btn icon slot="activator">
                    <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list>
                    <v-list-tile @click="">
                        <v-list-tile-title>Bearbeiten</v-list-tile-title>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile @click="">
                        <v-list-tile-title>Löschen</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-layout>
        <p class="answer-description">{{answer.answer}}</p>
        <v-layout row class="answer-commands">
            <div class="comment-icon">
                <v-icon>chat_bubble_outline</v-icon>
                <span class="comment-text">0 Kommentare</span>
            </div>
            <v-spacer></v-spacer>
            <div class="up-vote-button">
                <span class="up-votes">0</span>
                <v-btn icon outline :disabled="answer.isAdmin">
                    <v-icon>arrow_upward</v-icon>
                </v-btn>
            </div>
        </v-layout>
    </div>
</template>

<script>
    import UserInfo from './UserInfo.vue';

    export default {
        props: ['answer'],
        components: {UserInfo},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
    }
</script>

<style lang="scss">
    .text-answer-card {
        margin-bottom: 12px;
        .answer-description {
            margin-top: 12px;
            font-weight: 300;
            font-size: 16px;
            white-space: pre-wrap;
        }
        .answer-commands {
            margin-top: 6px;
            .comment-icon {
                padding-top: 2px;
                cursor: pointer;
                i.icon {
                    color: $primary-color;
                }
                .comment-text {
                    margin-left: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    color: $secondary-text;
                }
                :hover.comment-text {
                    text-decoration: underline;
                }
            }
            .up-vote-button {
                .up-votes {
                    margin-right: 6px;
                    position: relative;
                    top: 2px;
                    font-size: 16px;
                    font-weight: 500;
                    color: $secondary-text;
                }
                button {
                    margin: 0 4px 0 0;
                    height: 28px;
                    width: 28px;
                    border-width: 2px;
                    color: #009688;
                    i.icon {
                        font-size: 18px;
                    }
                }
            }
        }
    }
</style>
