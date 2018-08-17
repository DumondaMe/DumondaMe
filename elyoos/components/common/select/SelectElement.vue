<template>
    <div class="select-item">
        <div class="item-container" @click="select()"
             :class="{'item-selected': item.isSelected, 'sub-item-selected': item.subItemIsSelected,
             'disabled-item': disabled && !item.isSelected}">
            <div class="item" :class="{'main-bold': isRoot}">
                {{item.description}}
            </div>
            <v-spacer></v-spacer>
            <v-icon class="item-icon" v-show="item.isSelected">done</v-icon>
        </div>
        <div class="sub-items" v-if="(item.isSelected || (item.subItemIsSelected)) && item.subItems &&
                                        item.subItems.length > 0">
            <select-element :item="subItem" v-for="subItem in item.subItems"
                            :key="subItem.id" :is-root="false" :select-multiple="selectMultiple"
                            :dis-select-parent-items="disSelectParentItems" :disabled="disabled" :min-items="minItems"
                            :number-of-selected-items="numberOfSelectedItems"
                            @select-changed="childSelectChanged">
            </select-element>
        </div>
    </div>
</template>

<script>
    import SelectElement from './SelectElement';

    export default {
        name: 'select-element',
        props: ['item', 'isRoot', 'selectMultiple', 'disSelectParentItems', 'disabled', 'minItems',
            'numberOfSelectedItems'],
        components: {SelectElement},
        methods: {
            select() {
                if (!(this.disabled && !this.item.isSelected) &&
                    !(this.minItems && this.numberOfSelectedItems === this.minItems && this.item.isSelected)) {
                    this.item.isSelected = !this.item.isSelected;
                    if (this.item.isSelected) {
                        this.disSelectSubItems(this.item.subItems);
                        this.item.subItemIsSelected = false;
                    }
                    this.$emit('select-changed', {isSelected: this.item.isSelected, id: this.item.id});
                }
            },
            disSelectSubItems(subItems) {
                for (let item of subItems) {
                    item.isSelected = false;
                    item.subItemIsSelected = false;
                    if (item.subItems && item.subItems.length > 0) {
                        this.disSelectSubItems(item.subItems);
                    }
                }
            },
            isSubItemSelected(subItems) {
                for (let subItem of subItems) {
                    if (subItem.isSelected || (subItem.subItems && subItem.subItems.length > 0 &&
                        this.isSubItemSelected(subItem.subItems))) {
                        return true;
                    }
                }
                return false;
            },
            childSelectChanged(item) {
                if (this.disSelectParentItems) {
                    this.item.subItemIsSelected = this.isSubItemSelected(this.item.subItems);
                    this.item.isSelected = !this.item.subItemIsSelected;
                }
                this.$emit('select-changed', item)
            }
        }
    }
</script>

<style lang="scss">
    .select-item {
        .item-container {
            padding: 12px;
            border-bottom: 1px solid $divider;
            cursor: pointer;
            display: flex;
            .item-icon {
                margin-left: 18px;
                color: $success-text;
                user-select: none;
            }
            .item {
                user-select: none;
            }
            .item.main-bold {
                font-weight: 500;
            }
        }
        :hover.item-container {
            background-color: #EEEEEE;
        }
        .item-container.item-selected {
            color: $success-text;
            background-color: #EEEEEE;
            .item {
                color: $success-text;
            }
        }
        .item-container.disabled-item {
            cursor: not-allowed;
            background-color: #EEEEEE;
        }
        .sub-item-selected {
            font-weight: 500;
            background-color: #EEEEEE;
        }
        .sub-items {
            .select-item {
                .item-container {
                    padding-left: 22px;
                }
            }
        }
    }
</style>
