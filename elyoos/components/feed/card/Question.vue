<template>
    <div class="question-feed-card">
        <div class="question-header">
            <v-icon class="question-icon">mdi-help-circle-outline</v-icon>
            <span class="question-title"
                  @click="$router.push({name: 'question-questionId-slug',
                              params: {questionId: question.questionId, slug: question.questionSlug}})">{{question.question}}
                </span>
        </div>
        <expand-text :expand-text="question.descriptionHtml" class="question-description" itemprop="text">
        </expand-text>
        <card-footer :creator="question.creator.name" :creator-id="question.creator.userId"
                     :creator-slug="question.creator.slug" :created="question.created"
                     :number-of-answers="question.numberOfAnswers" :action="question.action" :card-type="question.type">
        </card-footer>
    </div>
</template>

<script>
    import CardFooter from './footer/Question';
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['question'],
        components: {CardFooter, ExpandText},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
    }
</script>

<style lang="scss">
    .question-feed-card {
        .question-description {
            margin-top: 12px;
            margin-bottom: 16px;
        }
        .question-header {
            display: block;
            line-height: 16px;
            .question-icon {
                margin-left: -2px;
                margin-right: 8px;
                font-size: 22px;
            }
            .question-title {
                cursor: pointer;
                font-size: 16px;
                vertical-align: middle;
                color: $primary-color;
                .link {
                    text-decoration: none;
                }
                :hover.link {
                    text-decoration: underline;
                }
            }
        }
    }
</style>
