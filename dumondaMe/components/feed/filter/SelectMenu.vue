<template>
    <div class="select-filter">
        <v-menu bottom offset-y>
            <template v-slot:activator="{ on }">
                <div class="select-filter-content" v-on="on">
                    <span>{{localSelectedItem.description}}</span>
                    <v-icon>{{$icons.mdiMenuDown}}</v-icon>
                </div>
            </template>
            <v-list>
                <v-list-item @click="itemSelected(item)" v-for="item in items" :key="item.id"
                             :disabled="localSelectedItem.id === item.id">
                    <v-list-item-title>{{item.description}}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
    import {mdiMenuDown} from "@mdi/js";

    export default {
        props: ['items', 'selectedItem'],
        data: function () {
            let selectedItem = this.items.find(item => item.id === this.selectedItem);
            return {localSelectedItem: JSON.parse(JSON.stringify(selectedItem))}
        },
        created() {
            this.$icons = {mdiMenuDown}
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
            font-size: 16px;
            display: flex;
            flex-wrap: nowrap;
            height: 26px;
            line-height: 26px;
            cursor: pointer;

            .v-icon {
                vertical-align: top;
            }
        }
    }

    :hover.select-filter {
        .select-filter-content {
            color: $primary-text;

            .v-icon {
                color: $primary-text;
            }
        }
    }
</style>
