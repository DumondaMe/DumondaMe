<template>
    <div id="create-answer-dialog">
        <select-answer-type @close-dialog="$emit('close-dialog')" v-if="showSelect"
                            @answer-selected="answerSelected">
        </select-answer-type>
        <answer-text v-else-if="!showSelect && answerType === 'text'" @close-dialog="$emit('close-dialog')"
                     :question="question">
        </answer-text>
    </div>
</template>

<script>
    import SelectAnswerType from './SelectAnswerType.vue';
    import AnswerText from './AnswerText.vue';

    export default {
        components: {SelectAnswerType, AnswerText},
        props: ['question'],
        data() {
            return {answerType: '', showSelect: true}
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
        methods: {
            answerSelected(type) {
                this.showSelect = false;
                this.answerType = type;
            }
        }
    }
</script>

<style lang="scss">
    #create-answer-dialog {
        width: 100%;
        height: 100%;
    }
</style>
