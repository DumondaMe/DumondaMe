<template>
    <div class="elyoos-answer-container">
        <div class="elyoos-answer-content">
            <div v-for="answer in answers">
                <text-card v-if="answer.answerType === 'Text'" :answer="answer">
                </text-card>
                <youtube-card v-if="answer.answerType === 'Youtube'" :answer="answer">
                </youtube-card>
            </div>
        </div>
    </div>
</template>

<script>
    import TextCard from './card/Text.vue';
    import YoutubeCard from './card/Youtube.vue';

    export default {
        components: {TextCard, YoutubeCard},
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
