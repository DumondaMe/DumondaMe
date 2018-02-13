<template>
    <div class="ely-card book-answer-card">
        <v-layout row>
            <user-info :name="answer.creator.name" :thumbnail-url="answer.creator.thumbnailUrl"
                       :created="answer.created" :isAdmin="answer.isAdmin" :link="getExternalLink"
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
            <div>
                <p class="answer-description" :class="{'no-book-image': !answer.imageUrl, 'expand': expandDescription}"
                   ref="answerDescription">{{answer.description}}</p>
                <div v-show="showTextExpanse && !expandDescription" class="expanse-button"
                     @click="expandDescription = true">{{$t('common:button.readMore')}}
                </div>
            </div>
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
        components: {UserInfo, AnswerCommands},
        data() {
            return {expandDescription: false}
        },
        computed: {
            showTextExpanse() {
                if (this.$refs.answerDescription) {
                    return this.$refs.answerDescription.scrollHeight > this.$refs.answerDescription.clientHeight;
                }
                return true;
            },
            getExternalLink() {
                let title = this.answer.title.replace(' ', '+');
                let authors = this.answer.authors.replace(',', '+');
                authors = this.answer.authors.replace(' ', '+');
                return `https://duckduckgo.com/?q="${title}"+${authors}&t=hf&ia=web`;
            }
        }
    }
</script>

<style lang="scss">
    .book-answer-card {
        margin-bottom: 12px;

        .book-answer-content {
            min-height: 90px;
            display: flex;
            .book-preview-image {
                img {
                    margin-top: 19px;
                    max-height: 250px;
                    max-width: 120px;
                }
            }
            .answer-description {
                margin-left: 18px;
                margin-top: 12px;
                margin-bottom: 4px;
                font-weight: 300;
                font-size: 16px;
                white-space: pre-wrap;
                line-height: 1.6em;
                max-height: 8em;
                overflow-y: hidden;
            }
            .answer-description.no-book-image {
                margin-left: 0;
            }
            .answer-description.expand {
                max-height: none;
            }
            .expanse-button {
                display: inline-block;
                margin-left: 18px;
                font-size: 12px;
                color: $secondary-text;
                cursor: pointer;
            }
            :hover.expanse-button {
                text-decoration: underline;
            }
        }
        .book-answer-content.no-book-image {
            min-height: 0;
        }
    }
</style>
