<template>
    <search-book v-if="selectedBook === null" @close-dialog="$emit('close-dialog')"
                 @selected-book="setSelected">
    </search-book>
    <edit-book v-else @close-dialog="(answer) => $emit('close-dialog', answer)" :init-book="selectedBook"
               :action-button-text="$t('pages:detailQuestion.createAnswerButton')" @selected-book="setSelected">
    </edit-book>
</template>

<script>
    import EditBook from './book/EditBook.vue';
    import SearchBook from './book/SearchBook.vue';
    import Vue from 'vue';

    export default {
        components: {EditBook, SearchBook},
        data() {
            return {selectedBook: null}
        },
        methods: {
            setSelected(newSelectedBook) {
                this.selectedBook = newSelectedBook;
            }
        }
    }
</script>

<style lang="scss">

</style>
