<template>
    <div id="feed-filter">
        <div class="type-filter-container">
            <v-tooltip top class="filter-element-container">
                <div class="filter-element" slot="activator"
                     :class="{'active-filter': mainFilter === 'question'}" @click="setFilter('question')">
                    <v-icon>mdi-help-circle-outline</v-icon>
                </div>
                <span>{{$t("pages:feeds.filter.tooltip.question")}}</span>
            </v-tooltip>
            <v-tooltip top class="filter-element-container">
                <div class="filter-element" slot="activator"
                     :class="{'active-filter': mainFilter === 'commitment'}" @click="setFilter('commitment')">
                    <v-icon>mdi-human-handsup</v-icon>
                </div>
                <span>{{$t("pages:feeds.filter.tooltip.commitment")}}</span>
            </v-tooltip>
            <v-tooltip top class="filter-element-container">
                <div class="filter-element" slot="activator"
                     :class="{'active-filter': mainFilter === 'event'}" @click="setFilter('event')">
                    <v-icon>mdi-calendar</v-icon>
                </div>
                <span>{{$t("pages:feeds.filter.tooltip.event")}}</span>
            </v-tooltip>
            <v-tooltip top class="filter-element-container" v-if="isAuthenticated">
                <div class="filter-element" slot="activator"
                     :class="{'active-filter': mainFilter === 'activity'}" @click="setFilter('activity')">
                    <v-icon slot="activator">mdi-clipboard-pulse-outline</v-icon>
                </div>
                <span>{{$t("pages:feeds.filter.tooltip.activity")}}</span>
            </v-tooltip>
            <v-spacer></v-spacer>
            <v-tooltip top class="right-filter-container" v-if="mainFilter !== 'event'"
                       :class="{'is-public': !isAuthenticated}">
                <div class="right-filter" slot="activator">
                    <common-filter-trust-circle :trust-circle="$store.state.feedFilter.trustCircleFilter"
                                                @trust-circle-changed="trustCircleChanged">
                    </common-filter-trust-circle>
                </div>
                <span>{{$t("pages:feeds.filter.tooltip.trustCircle")}}</span>
            </v-tooltip>
            <v-tooltip top class="right-filter-container">
                <div class="right-filter" slot="activator">
                    <common-filter-topic :init-topics="$store.state.feedFilter.topicFilter"
                                         @topic-changed="topicChanged">
                    </common-filter-topic>
                </div>
                <span>{{$t("pages:feeds.filter.tooltip.topic")}}</span>
            </v-tooltip>
            <v-menu bottom offset-y class="right-filter-container">
                <div class="right-filter" slot="activator">
                    <v-icon slot="activator">mdi-settings</v-icon>
                </div>
                <v-list>
                    <v-list-tile>
                        <v-list-tile-title>Reset Filter</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </div>
        <div id="feed-sub-filters">
            <sub-filter-activity v-if="mainFilter === 'activity'"></sub-filter-activity>
            <sub-filter-question v-else-if="mainFilter === 'question'"></sub-filter-question>
            <sub-filter-commitment v-else-if="mainFilter === 'commitment'"></sub-filter-commitment>
            <sub-filter-event v-else-if="mainFilter === 'event'"></sub-filter-event>
        </div>
    </div>
</template>

<script>
    import SubFilterActivity from './subFilter/Activity';
    import SubFilterQuestion from './subFilter/Question';
    import SubFilterCommitment from './subFilter/Commitment';
    import SubFilterEvent from './subFilter/Event';
    import CommonFilterTopic from './commonFilter/SelectTopic';
    import CommonFilterTrustCircle from './commonFilter/TrustCircle';

    export default {
        components: {
            SubFilterActivity, SubFilterQuestion, SubFilterCommitment, SubFilterEvent,
            CommonFilterTopic, CommonFilterTrustCircle
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            mainFilter() {
                return this.$store.state.feedFilter.mainFilter;
            }
        },
        data: function () {
            return {
                showTrustCircleFilter: false
            }
        },
        methods: {
            async setFilter(filter) {
                this.$store.commit('feedFilter/SET_MAIN_FILTER', filter);
                await this.$store.dispatch('feed/getFeed');
            },
            async topicChanged(topics) {
                this.$store.commit('feedFilter/SET_TOPIC_FILTER', topics);
                await this.$store.dispatch('feed/getFeed')
            },
            async trustCircleChanged() {
                await this.$store.dispatch('feed/getFeed');
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
                    i.v-icon {
                        font-size: 20px;
                    }
                }
                .filter-element.active-filter {
                    color: $primary-color;
                    font-weight: 500;
                    border-bottom: 3px solid $primary-color;
                    i.v-icon {
                        color: $primary-color;
                    }
                }
            }
            .right-filter-container {
                .right-filter {
                    cursor: pointer;
                    display: inline-block;
                    vertical-align: top;
                    margin-left: 16px;
                    padding: 0 0 4px 0;
                    i.v-icon {
                        font-size: 20px;
                    }
                }
            }
            .right-filter-container.is-public {
                .right-filter {
                    i.v-icon {
                        color: $disabled-text;
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
