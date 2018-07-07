<template>
    <div class="book-answer-feed-card">
        <div class="book-answer-content" :class="{'no-book-image': !answer.imageUrl}">
            <div class="book-preview-image" v-if="answer.imageUrl">
                <img :src="answer.imageUrl">
            </div>
            <div class="answer-description">
                <div class="title-container">
                    <v-icon class="card-type-icon">mdi-book-open-page-variant</v-icon>
                    <span class="card-title"><a :href="getQuestionLink">{{answer.title}}</a></span>
                </div>
                <question-to-answer :question-id="answer.questionId" :question-slug="answer.questionSlug"
                                    :question="answer.question">
                </question-to-answer>
                <expand-text :expand-text="answer.description"
                             :class="{'no-book-image': !answer.imageUrl}" itemprop="text">
                </expand-text>
            </div>
        </div>
        <card-footer :creator="answer.creator.name" :creator-id="answer.creator.userId"
                     :creator-slug="answer.creator.slug" :created="answer.created" :action="answer.action">
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
        data() {
            return {expandDescription: false}
        },
        computed: {
            getQuestionLink() {
                return `/question/${this.answer.questionId}/${this.answer.questionSlug}?answerId=${this.answer.answerId}`;
            }
        }
    }
</script>

<style lang="scss">
    .book-answer-feed-card {
        .book-answer-content {
            min-height: 90px;
            display: flex;
            margin-bottom: 16px;
            .book-preview-image {
                img {
                    border-radius: 2px;
                    margin-top: 6px;
                    max-height: 250px;
                    max-width: 120px;
                }
            }
            .answer-description {
                margin-left: 18px
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
