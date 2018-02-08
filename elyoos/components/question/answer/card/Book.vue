<template>
    <div class="ely-card book-answer-card">
        <v-layout row>
            <user-info :name="answer.creator.name" :thumbnail-url="answer.creator.thumbnailUrl"
                       :created="answer.created" :isAdmin="answer.isAdmin"
                       :answer-type="$t('pages:detailQuestion.answerType.book')" :answer-title="answer.title">
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
        <div class="book-answer-content" :class="{'no-book-image': !answer.imageUrl}">
            <div class="book-preview-image" v-if="answer.imageUrl">
                <img :src="answer.imageUrl">
            </div>
            <p class="answer-description" :class="{'no-book-image': !answer.imageUrl}">{{answer.description}}</p>
        </div>
        <answer-commands :answer="answer">
        </answer-commands>
    </div>
</template>

<script>
    import UserInfo from './UserInfo.vue';
    import AnswerCommands from './Commands.vue';

    export default {
        props: ['answer'],
        components: {UserInfo, AnswerCommands}
    }
</script>

<style lang="scss">
    .book-answer-card {
        margin-bottom: 12px;

        .book-answer-content {
            min-height: 90px;
            .book-preview-image {
                float: left;
                img {
                    margin-top: 5px;
                    max-height: 250px;
                    max-width: 120px;
                }
            }
            .answer-description {
                margin-left: 138px;
                margin-top: 12px;
                font-weight: 300;
                font-size: 16px;
                white-space: pre-wrap;
            }
            .answer-description.no-book-image {
                margin-left: 0;
            }
        }
        .book-answer-content.no-book-image {
            min-height: 0;
        }
    }
</style>
