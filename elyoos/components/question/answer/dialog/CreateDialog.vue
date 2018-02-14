<template>
    <select-answer-type @close-dialog="$emit('close-dialog')" v-if="showSelect"
                        @answer-selected="answerSelected">
    </select-answer-type>
    <answer-text v-else-if="answerType === 'text'" @close-dialog="closeDialog">
    </answer-text>
    <answer-link v-else-if="answerType === 'link'" @close-dialog="closeDialog">
    </answer-link>
    <answer-book v-else-if="answerType === 'book'" @close-dialog="closeDialog">
    </answer-book>
</template>

<script>
    import SelectAnswerType from './SelectAnswerType.vue';
    import AnswerText from './AnswerText.vue';
    import AnswerLink from './AnswerLink.vue';
    import AnswerBook from './AnswerBook.vue';
    import Vue from 'vue';

    export default {
        components: {SelectAnswerType, AnswerText, AnswerLink, AnswerBook},
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
            },
            async closeDialog(answerId) {
                this.$emit('close-dialog');
                await Vue.nextTick();
                let e = window.document.getElementById(`card-${answerId}`);
                if (!!e && e.scrollIntoView) {
                    e.scrollIntoView(true);
                    window.scrollBy(0, -62);
                }
            }
        }
    }
</script>

<style lang="scss">
</style>
