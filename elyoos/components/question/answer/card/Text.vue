<template>
    <div class="ely-card text-answer-card" :id="'card-' + answer.answerId"
         :class="{'new-added-answer': answer.newAddedAnswer}">
        <v-layout row class="text-answer-header">
            <user-info :name="answer.creator.name" :thumbnail-url="answer.creator.thumbnailUrl"
                       :isAdmin="answer.isAdmin" :created="answer.created" :answer-type="answer.answerType"
                       :answer-type-translated="$t('pages:detailQuestion.answerType.text')"
                       :userId="answer.creator.userId" :slug="answer.creator.slug">
            </user-info>
            <v-spacer></v-spacer>
            <v-menu bottom v-if="answer.isAdmin">
                <v-btn icon slot="activator">
                    <v-icon>mdi-dots-vertical</v-icon>
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
        <p class="answer-description" itemprop="text">{{answer.answer}}</p>
        <answer-commands :answer="answer"></answer-commands>
    </div>
</template>

<script>
    import UserInfo from './UserInfo.vue';
    import AnswerCommands from './Commands.vue';

    export default {
        props: ['answer'],
        components: {UserInfo, AnswerCommands},
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
            line-height: 1.6em;
        }
    }
</style>
