<template>
    <div id="select-container">
        <select-element :item="item" v-for="item in localItems" :key="item.id"
                        :is-root="true" :select-multiple="selectMultiple"
                        @select-changed="selectChanged">
        </select-element>
    </div>
</template>

<script>
    import SelectElement from './SelectElement';
    import Vue from 'vue';

    export default {
        props: ['items', 'existingItems', 'selectMultiple'],
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
                for (let item of items) {
                    if (existingItems && existingItems.find(existingItem => existingItem.id === item.id)) {
                        Vue.set(item, 'isSelected', true);
                    } else {
                        Vue.set(item, 'isSelected', false);
                    }
                    if (item.subItems && item.subItems.length > 0) {
                        this.setIsSelectedState(item.subItems, existingItems);
                    }
                }
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
            selectChanged() {
                let selected = [];
                this.getSelected(this.localItems, selected);
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
