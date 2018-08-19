<template>
    <div class="select-container">
        <select-element :item="item" v-for="item in localItems" :key="item.id"
                        :is-root="true" :select-multiple="selectMultiple"
                        :dis-select-parent-items="disSelectParentItems"
                        :disabled="maxItems && maxItems <= selected.length" :min-items="minItems"
                        :number-of-selected-items="selected.length"
                        @select-changed="selectChanged">
        </select-element>
    </div>
</template>

<script>
    import SelectElement from './SelectElement';
    import Vue from 'vue';

    export default {
        props: ['items', 'existingItems', 'selectMultiple', 'singleSelectedItemId', 'disSelectParentItems',
            'maxItems', 'minItems'],
        components: {SelectElement},
        data() {
            return {localItems: JSON.parse(JSON.stringify(this.items)), selected: []}
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
                        if (this.setIsSelectedState(item.subItems, existingItems)) {
                            Vue.set(item, 'subItemIsSelected', true);
                            hasSelected = true;
                        } else {
                            Vue.set(item, 'subItemIsSelected', false);
                        }
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
            onlyOneItemIsSelected(items, exceptItem) {
                for (let item of items) {
                    if (item.id !== exceptItem) {
                        item.isSelected = false;
                        item.subItemIsSelected = false;
                    }
                    if (item.subItems && item.subItems.length > 0) {
                        this.onlyOneItemIsSelected(item.subItems, exceptItem);
                    }
                }
            },
            disableOneItem(items, itemToDisable) {
                for (let item of items) {
                    if (item.id === itemToDisable) {
                        item.isSelected = false;
                        return;
                    }
                    if (item.subItems && item.subItems.length > 0) {
                        this.disableOneItem(item.subItems, itemToDisable);
                    }
                }
            },
            selectChanged(item) {
                this.selected = [];
                if (this.singleSelectedItemId && item.isSelected && item.id === this.singleSelectedItemId) {
                    this.onlyOneItemIsSelected(this.localItems, this.singleSelectedItemId);
                } else if (!this.selectMultiple && item.isSelected) {
                    this.setIsSelectedState(this.localItems, [{id: item.id}]);
                }

                this.getSelected(this.localItems, this.selected);
                if (this.singleSelectedItemId && item.id !== this.singleSelectedItemId) {

                    let singleSelectedSelected = this.selected.findIndex(selectedItem =>
                        selectedItem.id === this.singleSelectedItemId);
                    if (singleSelectedSelected !== -1) {
                        this.disableOneItem(this.localItems, this.singleSelectedItemId);
                        this.selected.splice(singleSelectedSelected, 1);
                    }
                }
                this.$emit('select-changed', this.selected);
            }
        }
    }
</script>

<style lang="scss">
    .select-container {
        border-top: 1px solid $divider;
        border-left: 1px solid $divider;
        border-right: 1px solid $divider;
        max-width: 400px;
        margin: 0 auto;
    }
</style>
