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
                            :dis-select-parent-items="disSelectParentItems"
                            @select-changed="childSelectChanged">
            </select-element>
        </div>
    </div>
</template>

<script>
    import SelectElement from './SelectElement';

    export default {
        name: 'select-element',
        props: ['item', 'isRoot', 'selectMultiple', 'disSelectParentItems'],
        components: {SelectElement},
        methods: {
            select() {
                this.item.isSelected = !this.item.isSelected;
                if (this.item.isSelected) {
                    this.disSelectSubItems(this.item.subItems);
                    this.item.subItemIsSelected = false;
                }
                this.$emit('select-changed', {isSelected: this.item.isSelected, id: this.item.id});
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
            .item-icon {
                float: right;
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
