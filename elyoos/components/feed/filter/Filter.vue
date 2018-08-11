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
            <div class="more-filter-container">
                <div class="more-filter">{{$t("pages:feeds.filter.moreFilter")}}</div>
                <v-icon>mdi-filter-variant</v-icon>
            </div>
        </div>
        <div id="feed-sub-filters">
            <sub-filter-activity v-if="activeTypeFilter === null"></sub-filter-activity>
            <sub-filter-question v-else-if="activeTypeFilter === 'question'"></sub-filter-question>
            <sub-filter-commitment v-else-if="activeTypeFilter === 'commitment'"></sub-filter-commitment>
            <sub-filter-event v-else-if="activeTypeFilter === 'event'"></sub-filter-event>
        </div>
    </div>
</template>

<script>
    import SubFilterActivity from './subFilter/Activity';
    import SubFilterQuestion from './subFilter/Question';
    import SubFilterCommitment from './subFilter/Commitment';
    import SubFilterEvent from './subFilter/Event';

    export default {
        components: {SubFilterActivity, SubFilterQuestion, SubFilterCommitment, SubFilterEvent},
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
                dialog: false, searchQuestion: true, personalizationActivated: false
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
                        font-size: 18px;
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
            .more-filter-container {
                height: 30px;
                line-height: 30px;
                cursor: pointer;
                .more-filter {
                    color: $secondary-text;
                    font-size: 14px;
                    display: inline-block;
                    margin-right: 8px;
                }
                i.icon {
                    padding-bottom: 2px;
                }
            }
            :hover.more-filter-container {
                .more-filter {
                    color: $primary-text;
                }
                i.icon {
                    color: $primary-text;
                }
            }
        }
        #feed-sub-filters {
            padding-top: 12px;
        }
    }
</style>
