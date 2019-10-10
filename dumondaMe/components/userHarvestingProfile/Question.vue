<template>
    <div class="user-harvesting-question-info">
        <div class="question-title" @click="$router.push({name: 'question-questionId-slug',
                     params: {questionId: question.questionId, slug: question.questionSlug}})">{{question.question}}
        </div>
        <expand-text :expand-text="question.descriptionHtml" class="description" v-if="question.descriptionHtml">
        </expand-text>
        <div class="info-container">
            <div class="info-icon-element">
                <v-icon size="20" color="primary">mdi-forum</v-icon>
                <span class="info-text">{{question.numberOfAnswers}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['question'],
        components: {ExpandText},
        computed: {},
        methods: {}
    }
</script>

<style lang="scss">
    .user-harvesting-question-info {
        @include defaultPaddingCard();
        margin-bottom: 8px;

        .question-title {
            cursor: pointer;
            color: $primary-color;
            font-size: 16px;
            font-weight: 400;
            margin-bottom: 12px;
        }

        :hover.question-title {
            text-decoration: underline;
        }

        .description {
            margin-top: 0;
            font-size: 16px;
            font-weight: 300;
            margin-bottom: 12px;
        }

        .info-container {

            .info-icon-element {
                display: inline-block;
                font-size: 16px;
                font-weight: 500;
                color: $secondary-text;
                margin-right: 12px;

                .info-text {
                    margin-left: 6px;
                    line-height: 20px;
                }
            }
        }
    }
</style>
