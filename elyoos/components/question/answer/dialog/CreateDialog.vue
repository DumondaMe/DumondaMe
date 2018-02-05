<template>
    <select-answer-type @close-dialog="$emit('close-dialog')" v-if="showSelect"
                        @answer-selected="answerSelected">
    </select-answer-type>
    <answer-text v-else-if="answerType === 'text'" @close-dialog="$emit('close-dialog')">
    </answer-text>
    <answer-link v-else-if="answerType === 'link'" @close-dialog="$emit('close-dialog')">
    </answer-link>
</template>

<script>
    import SelectAnswerType from './SelectAnswerType.vue';
    import AnswerText from './AnswerText.vue';
    import AnswerLink from './AnswerLink.vue';

    export default {
        components: {SelectAnswerType, AnswerText, AnswerLink},
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
</style>
