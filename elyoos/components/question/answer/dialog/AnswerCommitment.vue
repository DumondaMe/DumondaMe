<template>
    <search-commitment v-if="selectedCommitment === null" @close-dialog="$emit('close-dialog')"
                       @selected-commitment="setSelected">
    </search-commitment>
    <edit-commitment v-else @close-dialog="(answer) => $emit('close-dialog', answer)" :selected="selectedCommitment"
                     @selected-commitment="setSelected">
    </edit-commitment>
</template>

<script>
    import EditCommitment from './commitment/Edit';
    import SearchCommitment from './commitment/Search';

    export default {
        components: {EditCommitment, SearchCommitment},
        data() {
            return {selectedCommitment: null}
        },
        methods: {
            setSelected(newSelectedBook) {
                this.selectedCommitment = newSelectedBook;
            }
        }
    }
</script>

<style lang="scss">

</style>