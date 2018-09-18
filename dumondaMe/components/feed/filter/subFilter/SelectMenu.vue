<template>
    <div class="select-filter">
        <v-menu bottom offset-y>
            <div class="select-filter-content" slot="activator">
                <div>
                    <span>{{this.localSelectedItem.description}}</span>
                    <v-icon>mdi-menu-down</v-icon>
                </div>
            </div>
            <v-list>
                <v-list-tile @click="itemSelected(item)" v-for="item in items" :key="item.id"
                             :disabled="localSelectedItem.id === item.id">
                    <v-list-tile-title>{{item.description}}</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
    export default {
        props: ['items', 'selectedItem'],
        data: function () {
            let selectedItem = this.items.find(item => item.id === this.selectedItem);
            return {localSelectedItem: JSON.parse(JSON.stringify(selectedItem))}
        },
        watch: {
            selectedItem(newItem) {
                let selectedItem = this.items.find(item => item.id === newItem);
                this.localSelectedItem = JSON.parse(JSON.stringify(selectedItem));
            }
        },
        methods: {
            itemSelected(item) {
                this.localSelectedItem = item;
                this.$emit('changed', item.id)
            }
        }
    }
</script>

<style lang="scss">
    .select-filter {
        display: inline-block;
        margin-right: 18px;
        .select-filter-content {
            vertical-align: top;
            color: $secondary-text;
            font-size: 14px;
            display: inline-block;
            height: 26px;
            line-height: 26px;
            i.v-icon {
                vertical-align: top;
                //padding-bottom: 4px;
            }
        }
    }

    :hover.select-filter {
        .select-filter-content {
            color: $primary-text;
            i.v-icon {
                color: $primary-text;
            }
        }
    }
</style>
