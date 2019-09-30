<template>
    <div class="feed-filter ely-card" v-show="$store.getters['feedFilter/isSubFilterActive']">
        <div class="filter-header" :class="{'activated': activated && expanded}">
            <v-switch v-model="activated" :label="filterText" color="primary"></v-switch>
            <v-spacer></v-spacer>
            <v-btn icon class="expand-button" @click="expanded = !expanded" v-show="activated">
                <v-icon v-if="!expanded">mdi-chevron-down</v-icon>
                <v-icon v-else>mdi-chevron-up</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        components: {},
        computed: {
            filterText() {
                if (this.activated) {
                    return 'Filter ist aktiv'
                }
                return 'Filter ist deaktiviert'
            }
        },
        data: function () {
            return {activated: this.$store.getters['feedFilter/isSubFilterActive'], expanded: false}
        },
        methods: {}
    }
</script>

<style lang="scss">
    .feed-filter.ely-card {
        padding-top: 0;
        padding-bottom: 0;
        margin-bottom: 8px;

        .filter-header {
            display: flex;
            @include defaultPaddingCard();

            .v-input {
                margin-top: 12px;

                .v-input__slot {
                    margin-bottom: 0;
                }
            }

            .expand-button {
                margin-top: 10px;
            }
        }

        .filter-header.activated {
            border-bottom: 1px solid $divider;
        }
    }
</style>
