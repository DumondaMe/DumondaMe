<template>
    <div class="elyoos-answer-container">
        <div class="elyoos-answer-content">
            <div v-for="answer in answers">
                <text-card v-if="answer.answerType === 'Text'" :answer="answer">
                </text-card>
                <youtube-card v-else-if="answer.answerType === 'Youtube'" :answer="answer">
                </youtube-card>
                <link-card v-else-if="answer.answerType === 'Link'" :answer="answer">
                </link-card>
            </div>
        </div>
    </div>
</template>

<script>
    import TextCard from './card/Text.vue';
    import YoutubeCard from './card/Youtube.vue';
    import LinkCard from './card/Link.vue';

    export default {
        components: {TextCard, YoutubeCard, LinkCard},
        computed: {
            answers() {
                return this.$store.state.question.question.answers;
            }
        }
    }
</script>

<style lang="scss">
    .elyoos-answer-container {
        .elyoos-answer-content {
            .ely-card {
                .menu {
                    button {
                        margin: 0;
                    }
                }
            }
        }
    }
</style>
