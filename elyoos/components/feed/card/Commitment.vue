<template>
    <div class="commitment-answer-feed-card">
        <v-layout row>
            <user-info :isAdmin="answer.isAdmin" :card-type="answer.type"
                       :question-id="answer.questionId" :question-slug="answer.questionSlug"
                       :question="answer.question" v-if="answer.type === 'CommitmentAnswer'">
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
            <div class="answer-description">
                <div class="title-container">
                    <v-icon class="card-type-icon">mdi-human-handsup</v-icon>
                    <span class="card-title" @click="$router.push({name: 'commitment-commitmentId-slug',
                     params: {commitmentId: answer.commitmentId, slug: answer.commitmentSlug}})">{{answer.title}}</span>
                </div>
                <expand-text :expand-text="answer.description"
                             :class="{'no-commitment-image': !answer.imageUrl}" itemprop="text">
                </expand-text>
            </div>
        </div>
        <card-footer :user="answer.creator.name" :userId="answer.creator.userId" :userSlug="answer.creator.slug"
                     :created="answer.created" :action="answer.action">
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
                    margin-top: 12px;
                    width: 120px;
                    height: 120px;
                    border-radius: 2px;
                }
            }
            .answer-description {
                margin-left: 18px;
                margin-top: 5px;
            }
            .answer-description.no-commitment-image {
                margin-left: 0;
            }
        }
    }
</style>
