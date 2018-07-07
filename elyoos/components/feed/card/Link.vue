<template>
    <div class="link-answer-feed-card">
        <div class="link-answer-content">
            <div class="link-preview-image" v-if="answer.imageUrl">
                <img :src="answer.imageUrl">
            </div>
            <div class="answer-description" :class="{'no-link-image': !answer.imageUrl}">
                <div class="title-container">
                    <v-icon class="card-type-icon">mdi-link</v-icon>
                    <span class="card-title"><a :href="getQuestionLink">{{answer.title}}</a></span>
                </div>
                <question-to-answer :question-id="answer.questionId" :question-slug="answer.questionSlug"
                                    :question="answer.question">
                </question-to-answer>
                <expand-text :expand-text="answer.description"
                             :class="{'no-link-image': !answer.imageUrl}" itemprop="text">
                </expand-text>
            </div>
        </div>
        <card-footer :creator="answer.creator.name" :creator-id="answer.creator.userId"
                     :creator-slug="answer.creator.slug" :created="answer.created" :action="answer.action"
                     :card-type="answer.type">
        </card-footer>
    </div>
</template>

<script>
    import CardFooter from './footer/CommonAnswer';
    import QuestionToAnswer from './QuestionToAnswer';
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['answer'],
        components: {CardFooter, QuestionToAnswer, ExpandText},
        computed: {
            answerType() {
                if (this.answer.pageType) {
                    return this.$t(`pages:detailQuestion.answerType.link.${this.answer.pageType}`)
                }
                return this.$t(`pages:detailQuestion.answerType.link.link`)
            },
            getQuestionLink() {
                return `/question/${this.answer.questionId}/${this.answer.questionSlug}?answerId=${this.answer.answerId}`;
            }
        }
    }
</script>

<style lang="scss">
    .link-answer-feed-card {
        .link-answer-content {
            margin-bottom: 16px;
            min-height: 90px;
            display: flex;
            .link-preview-image {
                img {
                    border-radius: 2px;
                    margin-top: 5px;
                    max-width: 120px;
                }
            }
            .answer-description {
                margin-left: 18px;
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
