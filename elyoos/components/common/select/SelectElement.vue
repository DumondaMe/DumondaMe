<template>
    <div class="select-item">
        <div class="item-container" @click="select()"
             :class="{'item-selected': item.isSelected, 'sub-item-selected': item.subItemIsSelected}">
            <v-icon class="item-icon" v-show="item.isSelected">done</v-icon>
            <div class="item" :class="{'main-bold': isRoot}">
                {{item.description}}
            </div>
        </div>
        <div class="sub-items" v-if="(item.isSelected || (item.subItemIsSelected)) && item.subItems &&
                                        item.subItems.length > 0">
            <select-element :item="subItem" v-for="subItem in item.subItems"
                            :key="subItem.id" :is-root="false" :select-multiple="selectMultiple"
                            @select-changed="$emit('select-changed')">
            </select-element>
        </div>
    </div>
</template>

<script>
    import SelectElement from './SelectElement';

    export default {
        name: 'select-element',
        props: ['item', 'isRoot', 'selectMultiple'],
        components: {SelectElement},
        methods: {
            select() {
                this.item.isSelected = !this.item.isSelected;
                this.disSelectSubItems(this.item.subItems);
                this.$emit('select-changed');
            },
            disSelectSubItems(subItems) {
                for (let item of subItems) {
                    item.isSelected = false;
                    if (item.subItems && item.subItems.length > 0) {
                        this.disSelectSubItems(item.subItems);
                    }
                }
            },
        }
    }
</script>

<style lang="scss">
    .select-item {
        .item-container {
            padding: 12px;
            border-bottom: 1px solid $divider;
            cursor: pointer;
            .item-icon {
                float: right;
                color: $success-text;
            }
            .item {
                user-select: none;
            }
            .item.main-bold {
                color: $primary-color;
                //font-weight: 500;
            }
        }
        :hover.item-container {
            background-color: #EEEEEE;
        }
        .item-container.item-selected {
            font-weight: 500;
            color: $success-text;
            background-color: #EEEEEE;
            .item {
                color: $success-text;
            }
        }
        .sub-item-selected {
            font-weight: 500;
            background-color: #EEEEEE;
        }
    }
</style>
