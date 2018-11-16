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

    export default {
        props: ['initCommitment'],
        components: {EditCommitment, SearchCommitment},
        data() {
            let selectedCommitment = null;
            if (this.initCommitment && this.initCommitment.commitmentId) {
                selectedCommitment = JSON.parse(JSON.stringify(this.initCommitment));
            }
            return {selectedCommitment}
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