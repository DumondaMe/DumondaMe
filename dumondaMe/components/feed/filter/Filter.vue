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
        <div class="filter-detail-content" v-show="activated && expanded">
            <topic-filter-content :topics="topicFeedFilter"></topic-filter-content>
        </div>
    </div>
</template>

<script>
    import TopicFilterContent from './Topic';

    export default {
        components: {TopicFilterContent},
        computed: {
            filterText() {
                if (this.activated) {
                    return this.$t('pages:feeds.filter.activated');
                }
                return this.$t('pages:feeds.filter.deactivated');
            },
            topicFeedFilter() {
                return this.$store.state.feedFilter.topicFilter
            }
        },
        data: function () {
            return {
                activated: this.$store.getters['feedFilter/isSubFilterActive'] &&
                    this.$store.state.feedFilter.filterActive,
                expanded: this.$store.state.feedFilter.isExpanded
            }
        },
        watch: {
            activated(newFilterState) {
                this.$store.commit('feedFilter/SET_FILTER_ACTIVE', newFilterState);
            },
            expanded(newExpandState) {
                this.$store.commit('feedFilter/SET_FILTER_EXPANDED', newExpandState);
            }
        }
    }
</script>

<style lang="scss">
    .feed-filter.ely-card {
        padding-top: 0;
        padding-bottom: 0;
        margin-bottom: 18px;
        max-width: 550px;
        background-color: #e0f2f1;

        @media screen and (max-width: $xs) {
            margin: 8px auto;
        }

        .filter-header {
            display: flex;
            @include defaultPaddingCard();

            .v-input {
                margin-top: 12px;

                .v-input__slot {
                    margin-bottom: 0;

                    .v-label {
                        font-weight: 500;
                        color: $secondary-text;
                    }
                }
            }

            .expand-button {
                margin-top: 10px;
            }
        }

        .filter-header.activated {
            border-bottom: 1px solid $divider;
        }

        .filter-detail-content {
            @include defaultPaddingCard();
            padding-top: 12px;
            padding-bottom: 4px;
        }
    }
</style>
