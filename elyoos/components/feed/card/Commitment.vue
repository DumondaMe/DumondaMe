<template>
    <div class="commitment-answer-feed-card">
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
                <question-to-answer :question-id="answer.questionId" :question-slug="answer.questionSlug"
                                    :question="answer.question">
                </question-to-answer>
                <expand-text :expand-text="answer.description"
                             :class="{'no-commitment-image': !answer.imageUrl}" itemprop="text">
                </expand-text>
            </div>
        </div>
        <card-footer :creator="answer.creator.name" :creator-id="answer.creator.userId"
                     :creator-slug="answer.creator.slug" :created="answer.created" :action="answer.action"
                     :regions="answer.regions" :card-type="answer.type">
        </card-footer>
    </div>
</template>

<script>
    import CardFooter from './footer/Commitment';
    import QuestionToAnswer from './QuestionToAnswer';
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['answer'],
        components: {CardFooter, QuestionToAnswer, ExpandText},
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
            margin-bottom: 16px;
            display: flex;
            .commitment-preview-image {
                img {
                    margin-top: 3px;
                    width: 120px;
                    height: 120px;
                    border-radius: 2px;
                }
            }
            .answer-description {
                margin-left: 18px;
                word-wrap: break-word;
            }
            .answer-description.no-commitment-image {
                margin-left: 0;
            }
        }
    }
</style>
