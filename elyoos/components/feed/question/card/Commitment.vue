<template>
    <div class="commitment-answer-feed-card">
        <v-layout row>
            <user-info :isAdmin="answer.isAdmin" :card-type="answer.type"
                       :card-type-translated="$t('pages:detailQuestion.answerType.commitment')"
                       :answer-title="answer.title" :commitment-id="answer.commitmentId"
                       :commitment-slug="answer.commitmentSlug"
                       :question-id="answer.questionId" :question-slug="answer.questionSlug"
                       :question="answer.question">
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
        <div class="commitment-answer-content">
            <div class="commitment-preview-image">
                <img :src="answer.imageUrl">
            </div>
            <expand-text :expand-text="answer.description" class="answer-description"
                         :class="{'no-commitment-image': !answer.imageUrl}" itemprop="text">
            </expand-text>
        </div>
        <card-footer :user="answer.creator.name" :userId="answer.creator.userId" :userSlug="answer.creator.slug"
                     :created="answer.created">
        </card-footer>
    </div>
</template>

<script>
    import UserInfo from './UserInfo.vue';
    import CardFooter from './footer.vue';
    import AnswerCommands from '~/components/question/answer/card/Commands.vue';
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['answer'],
        components: {UserInfo, CardFooter, AnswerCommands, ExpandText},
        data() {
            return {expandDescription: false}
        },
        computed: {
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
    .commitment-answer-feed-card {
        .commitment-answer-content {
            min-height: 90px;
            display: flex;
            .commitment-preview-image {
                img {
                    margin-top: 19px;
                    width: 120px;
                    height: 120px;
                    border-radius: 2px;
                }
            }
            .answer-description {
                margin-left: 18px;
                margin-top: 13px;
            }
            .answer-description.no-commitment-image {
                margin-left: 0;
            }
        }
    }
</style>
