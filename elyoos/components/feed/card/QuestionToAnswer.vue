<template>
    <div class="question-to-answer-container">
        <span class="question-title"
              @click="$router.push({name: 'question-questionId-slug',
                              params: {questionId: questionId, slug: questionSlug}})">{{question}}
                </span>
    </div>
</template>

<script>
    export default {
        props: ['questionId', 'questionSlug', 'question']
    }
</script>

<style lang="scss">
    .question-to-answer-container {
        margin-bottom: 8px;
        .question-title {
            cursor: pointer;
            font-size: 12px;
            line-height: 20px;
            font-weight: 400;
            color: $secondary-text;
        }
        :hover.question-title {
            text-decoration: underline;
        }
    }
</style>