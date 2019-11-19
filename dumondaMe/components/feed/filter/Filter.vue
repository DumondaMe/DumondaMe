<template>
    <div class="feed-filter ely-card">
        <div class="filter-header" :class="{'activated': activated && expanded}">
            <v-switch v-model="activated" :label="filterText" color="primary" :disabled="!hasFilter"></v-switch>
            <v-spacer></v-spacer>
            <div class="select-order" v-show="hasOrder">
                <select-menu :items="[{id: 'newest', description: $t('pages:feeds.filter.order.newest')},
                                      {id: 'mostPopular', description: $t('pages:feeds.filter.order.popular')}]"
                             :selected-item="$store.state.feedFilter.sortOrder" @changed="sortOrderChanged">
                </select-menu>
            </div>
        </div>
        <div class="filter-detail-content" v-show="activated && expanded">
            <topic-filter-content :topics="topicFeedFilter"></topic-filter-content>
        </div>
    </div>
</template>

<script>
    import TopicFilterContent from './Topic';
    import SelectMenu from './SelectMenu';

    export default {
        components: {TopicFilterContent, SelectMenu},
        data: function () {
            return {
                activated: this.$store.getters['feedFilter/isSubFilterActive'] &&
                    this.$store.state.feedFilter.filterActive,
                expanded: this.$store.state.feedFilter.isExpanded
            }
        },
        computed: {
            filterText() {
                if (this.activated) {
                    return this.$t('pages:feeds.filter.activated');
                }
                return this.$t('pages:feeds.filter.deactivated');
            },
            topicFeedFilter() {
                return this.$store.state.feedFilter.topicFilter
            },
            hasFilter() {
                return this.$store.state.feedFilter.topicFilter && this.$store.state.feedFilter.topicFilter.length > 0;
            },
            hasOrder() {
                return this.$route.name === 'question' || this.$route.name === 'commitment';
            }
        },
        methods: {
            async sortOrderChanged(item) {
                this.$store.commit('feedFilter/SET_SORT_ORDER', item);
                await this.$store.dispatch('feed/getFeed');
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

            .sort-button {
                margin-top: 10px;
            }

            .select-order {
                margin-left: 8px;
                margin-top: 14px;
                @media screen and (min-width: 700px) {
                    margin-top: 15px;
                }
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
