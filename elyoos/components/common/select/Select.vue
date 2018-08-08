<template>
    <div id="select-container">
        <select-element :item="item" v-for="item in localItems" :key="item.id"
                        :is-root="true" :select-multiple="selectMultiple"
                        :dis-select-parent-items="disSelectParentItems"
                        @select-changed="selectChanged">
        </select-element>
    </div>
</template>

<script>
    import SelectElement from './SelectElement';
    import Vue from 'vue';

    export default {
        props: ['items', 'existingItems', 'selectMultiple', 'singleSelectedItemId', 'disSelectParentItems'],
        components: {SelectElement},
        data() {
            return {localItems: JSON.parse(JSON.stringify(this.items))}
        },
        watch: {
            items(newItems) {
                this.localItems = JSON.parse(JSON.stringify(newItems));
                this.setIsSelectedState(this.localItems, this.existingItems);
            }
        },
        methods: {
            setIsSelectedState(items, existingItems) {
                let hasSelected = false;
                for (let item of items) {
                    if (existingItems && existingItems.find(existingItem => existingItem.id === item.id)) {
                        Vue.set(item, 'isSelected', true);
                        hasSelected = true;
                    } else {
                        Vue.set(item, 'isSelected', false);
                    }
                    if (item.subItems && item.subItems.length > 0) {
                        Vue.set(item, 'subItemIsSelected', this.setIsSelectedState(item.subItems, existingItems));
                    } else {
                        Vue.set(item, 'subItemIsSelected', false);
                    }
                }
                return hasSelected;
            },
            getSelected(items, selected) {
                for (let item of items) {
                    if (item.isSelected) {
                        selected.push({id: item.id, description: item.description});
                    }
                    if (item.subItems && item.subItems.length > 0) {
                        this.getSelected(item.subItems, selected);
                    }
                }
                return selected;
            },
            setNotSelectedExceptOneItem(items, exceptItem) {
                for (let item of items) {
                    if (item.id !== exceptItem) {
                        item.isSelected = false;
                        item.subItemIsSelected = false;
                    }
                    if (item.subItems && item.subItems.length > 0) {
                        this.setNotSelectedExceptOneItem(item.subItems, exceptItem);
                    }
                }
            },
            disableSingleSelectedItem(items, itemToDisable) {
                for (let item of items) {
                    if (item.id === itemToDisable) {
                        item.isSelected = false;
                        return;
                    }
                    if (item.subItems && item.subItems.length > 0) {
                        this.disableSingleSelectedItem(item.subItems, itemToDisable);
                    }
                }
            },
            selectChanged(item) {
                let selected = [];
                if (this.singleSelectedItemId && item.isSelected && item.id === this.singleSelectedItemId) {
                    this.setNotSelectedExceptOneItem(this.localItems, this.singleSelectedItemId)
                }

                this.getSelected(this.localItems, selected);

                if (this.singleSelectedItemId && item.id !== this.singleSelectedItemId) {

                    let singleSelectedSelected = selected.findIndex(selectedItem =>
                        selectedItem.id === this.singleSelectedItemId);
                    if (singleSelectedSelected !== -1) {
                        this.disableSingleSelectedItem(this.localItems, this.singleSelectedItemId);
                        selected.slice(singleSelectedSelected, 1);
                    }
                }
                this.$emit('select-changed', selected);
            }
        }
    }
</script>

<style lang="scss">
    #select-container {
        border-top: 1px solid $divider;
        border-left: 1px solid $divider;
        border-right: 1px solid $divider;
        max-width: 400px;
        margin: 0 auto;
    }
</style>
