<template>
    <search-commitment v-if="selectedCommitment === null" @close-dialog="$emit('close-dialog')"
                       @selected-commitment="setSelected">
    </search-commitment>
    <edit-commitment v-else @close-dialog="(answer) => $emit('close-dialog', answer)"
                     @selected-commitment="setSelected" :init-commitment="selectedCommitment"
                     :action-button-text="$t('pages:detailQuestion.createAnswerButton')">
    </edit-commitment>
</template>

<script>
    import EditCommitment from './commitment/Edit';
    import SearchCommitment from './commitment/Search';
    import Vue from 'vue';

    export default {
        components: {EditCommitment, SearchCommitment},
        data() {
            return {selectedCommitment: null}
        },
        methods: {
            setSelected(newSelectedCommitment) {
                this.selectedCommitment = newSelectedCommitment;
            }
        }
    }
</script>

<style lang="scss">

</style>