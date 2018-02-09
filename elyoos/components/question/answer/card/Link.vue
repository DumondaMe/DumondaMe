<template>
    <div class="ely-card link-answer-card">
        <v-layout row>
            <user-info :name="answer.creator.name" :thumbnail-url="answer.creator.thumbnailUrl"
                       :created="answer.created" :isAdmin="answer.isAdmin"
                       :answer-type="answerType" :answer-title="answer.title">
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
        <div class="link">
            <a target="_blank" :href="answer.link">{{link}}</a>
        </div>
        <div class="link-answer-content" :class="{'no-link-image': !answer.imageUrl}">
            <div class="link-preview-image" v-if="answer.imageUrl">
                <img :src="answer.imageUrl">
            </div>
            <p class="answer-description" :class="{'no-link-image': !answer.imageUrl}">{{answer.description}}</p>
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
        computed: {
            answerType() {
                if (this.answer.pageType) {
                    return this.$t(`pages:detailQuestion.answerType.link.${this.answer.pageType}`)
                }
                return this.$t(`pages:detailQuestion.answerType.link.link`)
            },
            link() {
                return this.answer.link.replace(/^(http|https):\/\//i, '');
            }
        }
    }
</script>

<style lang="scss">
    .link-answer-card {
        margin-bottom: 12px;

        .link {
            margin-top: 4px;
            font-size: 12px;
        }
        .link-answer-content {
            min-height: 90px;
            .link-preview-image {
                float: left;
                img {
                    margin-top: 5px;
                    max-height: 90px;
                    max-width: 120px;
                }
            }
            .answer-description {
                margin-left: 138px;
                margin-top: 12px;
                font-weight: 300;
                font-size: 16px;
                white-space: pre-wrap;
                line-height: 1.6em;
            }
            .answer-description.no-link-image {
                margin-left: 0;
            }
        }
        .link-answer-content.no-link-image {
            min-height: 0;
        }
    }
</style>
