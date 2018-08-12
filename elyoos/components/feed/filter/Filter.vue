<template>
    <div id="feed-filter">
        <div class="type-filter-container">
            <v-tooltip top class="filter-element-container">
                <div class="filter-element" slot="activator"
                     :class="{'active-filter': activeTypeFilter === null}" @click="setFilter(null)">
                    <v-icon slot="activator">mdi-clipboard-pulse-outline</v-icon>
                </div>
                <span>{{$t("pages:feeds.filter.tooltip.activity")}}</span>
            </v-tooltip>
            <v-tooltip top class="filter-element-container">
                <div class="filter-element" slot="activator"
                     :class="{'active-filter': activeTypeFilter === 'question'}" @click="setFilter('question')">
                    <v-icon>mdi-help-circle-outline</v-icon>
                </div>
                <span>{{$t("pages:feeds.filter.tooltip.question")}}</span>
            </v-tooltip>
            <v-tooltip top class="filter-element-container">
                <div class="filter-element" slot="activator"
                     :class="{'active-filter': activeTypeFilter === 'commitment'}" @click="setFilter('commitment')">
                    <v-icon>mdi-human-handsup</v-icon>
                </div>
                <span>{{$t("pages:feeds.filter.tooltip.commitment")}}</span>
            </v-tooltip>
            <v-tooltip top class="filter-element-container">
                <div class="filter-element" slot="activator"
                     :class="{'active-filter': activeTypeFilter === 'event'}" @click="setFilter('event')">
                    <v-icon>mdi-calendar</v-icon>
                </div>
                <span>{{$t("pages:feeds.filter.tooltip.event")}}</span>
            </v-tooltip>
            <v-spacer></v-spacer>
            <v-tooltip top class="right-filter-container">
                <div class="right-filter" slot="activator" @click="showTrustCircleFilter = true">
                    <v-icon slot="activator">mdi-checkbox-blank-circle-outline</v-icon>
                </div>
                <span>{{$t("pages:feeds.filter.tooltip.trustCircle")}}</span>
            </v-tooltip>
            <v-tooltip top class="right-filter-container">
                <div class="right-filter" slot="activator">
                    <v-icon slot="activator">mdi-bookmark-outline</v-icon>
                </div>
                <span>{{$t("pages:feeds.filter.tooltip.topic")}}</span>
            </v-tooltip>
            <v-menu bottom offset-y class="right-filter-container">
                <div class="right-filter" slot="activator">
                    <v-icon slot="activator">mdi-settings</v-icon>
                </div>
                <v-list>
                    <v-list-tile>
                        <v-list-tile-title>Sprachfilter</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-title>Reset Filter</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </div>
        <div id="feed-sub-filters">
            <sub-filter-activity v-if="activeTypeFilter === null"></sub-filter-activity>
            <sub-filter-question v-else-if="activeTypeFilter === 'question'"></sub-filter-question>
            <sub-filter-commitment v-else-if="activeTypeFilter === 'commitment'"></sub-filter-commitment>
            <sub-filter-event v-else-if="activeTypeFilter === 'event'"></sub-filter-event>
        </div>
        <edit-trust-circle-filter-dialog v-if="showTrustCircleFilter"
                                         @close-dialog="showTrustCircleFilter = false">
        </edit-trust-circle-filter-dialog>
    </div>
</template>

<script>
    import SubFilterActivity from './subFilter/Activity';
    import SubFilterQuestion from './subFilter/Question';
    import SubFilterCommitment from './subFilter/Commitment';
    import SubFilterEvent from './subFilter/Event';
    import EditTrustCircleFilterDialog from './dialog/EditTrustCircleFilter';

    export default {
        components: {
            SubFilterActivity, SubFilterQuestion, SubFilterCommitment, SubFilterEvent,
            EditTrustCircleFilterDialog
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            activeTypeFilter() {
                return this.$store.state.feed.typeFilter;
            }
        },
        data: function () {
            return {
                showTrustCircleFilter: false
            }
        },
        methods: {
            async setFilter(filter) {
                if (filter) {
                    this.$router.push({query: Object.assign({}, this.$route.query, {typeFilter: filter})});
                } else {
                    this.$router.push({query: null});
                }
                await this.$store.dispatch('feed/setTypeFilter',
                    {filter, isAuthenticated: this.isAuthenticated});
            }
        }
    }
</script>

<style lang="scss">
    #feed-filter {
        .type-filter-container {
            display: flex;
            border-bottom: 1px solid $divider;
            .filter-element-container {
                display: inline-block;
                .filter-element {
                    cursor: pointer;
                    font-size: 14px;
                    padding: 2px 12px 4px 12px;
                    color: $secondary-text;
                    i.icon {
                        font-size: 20px;
                    }
                }
                .filter-element.active-filter {
                    color: $primary-color;
                    font-weight: 500;
                    border-bottom: 3px solid $primary-color;
                    i.icon {
                        color: $primary-color;
                    }
                }
            }
            .right-filter-container {
                .right-filter {
                    cursor: pointer;
                    display: inline-block;
                    margin-left: 16px;
                    padding: 2px 0 4px 0;
                    i.icon {
                        font-size: 20px;
                    }
                }

            }
            :hover.right-filter-container {
                .more-filter {
                    color: $primary-text;
                }

            }
        }
        #feed-sub-filters {
            padding-top: 12px;
        }
    }
</style>
