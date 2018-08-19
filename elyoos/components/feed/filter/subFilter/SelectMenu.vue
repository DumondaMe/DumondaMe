<template>
    <div class="select-filter">
        <v-menu bottom offset-y>
            <div class="select-filter-content" slot="activator">
                <span>{{this.localSelectedItem.description}}</span>
                <v-icon>mdi-menu-down</v-icon>
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
        components: {},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
        data: function () {
            let selectedItem = this.items.find(item => item.id === this.selectedItem);
            return {localSelectedItem: JSON.parse(JSON.stringify(selectedItem))}
        },
        methods: {
            itemSelected(item) {
                this.localSelectedItem = item;
                this.$emit('changed', item)
            }
        }
    }
</script>

<style lang="scss">
    .select-filter {
        display: inline-block;
        margin-right: 18px;
        .select-filter-content {
            color: $secondary-text;
            font-size: 14px;
            display: inline-block;
            height: 26px;
            line-height: 26px;
            i.icon {
                padding-bottom: 4px;
            }
        }
    }

    :hover.select-filter {
        .select-filter-content {
            color: $primary-text;
            i.icon {
                color: $primary-text;
            }
        }
    }
</style>
