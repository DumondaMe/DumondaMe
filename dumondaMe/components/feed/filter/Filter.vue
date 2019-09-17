<template>
    <div id="feed-filter">
        <div class="type-filter-container">
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <div class="filter-element" v-on="on"
                         :class="{'active-filter': mainFilter === 'activity'}" @click="setFilter('activity')">
                        <v-icon>mdi-heart-pulse</v-icon>
                    </div>
                </template>
                <span v-if="isAuthenticated">{{$t("pages:feeds.filter.tooltip.activity")}}</span>
                <span v-else>{{$t("pages:feeds.filter.tooltip.activityPublic")}}</span>
            </v-tooltip>
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <div class="filter-element" v-on="on"
                         :class="{'active-filter': mainFilter === 'question'}" @click="setFilter('question')">
                        <v-icon>mdi-help-circle-outline</v-icon>
                    </div>
                </template>
                <span>{{$t("pages:feeds.filter.tooltip.question")}}</span>
            </v-tooltip>
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <div class="filter-element" v-on="on"
                         :class="{'active-filter': mainFilter === 'commitment'}" @click="setFilter('commitment')">
                        <v-icon>mdi-human-handsup</v-icon>
                    </div>
                </template>
                <span>{{$t("pages:feeds.filter.tooltip.commitment")}}</span>
            </v-tooltip>
            <v-tooltip top class="filter-element-container">
                <template v-slot:activator="{ on }">
                    <div class="filter-element" v-on="on"
                         :class="{'active-filter': mainFilter === 'event'}" @click="setFilter('event')">
                        <v-icon>mdi-calendar</v-icon>
                    </div>
                </template>
                <span>{{$t("pages:feeds.filter.tooltip.event")}}</span>
            </v-tooltip>
            <v-spacer></v-spacer>
            <v-tooltip top v-if="mainFilter !== 'event'">
                <template v-slot:activator="{ on }">
                    <div class="right-filter" v-on="on">
                        <common-filter-trust-circle :trust-circle="$store.state.feedFilter.trustCircleFilter"
                                                    @trust-circle-changed="trustCircleChanged">
                        </common-filter-trust-circle>
                    </div>
                </template>
                <span>{{$t("pages:feeds.filter.tooltip.trustCircle")}}</span>
            </v-tooltip>
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <div class="right-filter" v-on="on">
                        <common-filter-topic :init-topics="$store.state.feedFilter.topicFilter"
                                             @topic-changed="topicChanged">
                        </common-filter-topic>
                    </div>
                </template>
                <span>{{$t("pages:feeds.filter.tooltip.topic")}}</span>
            </v-tooltip>
        </div>
        <div id="feed-sub-filters">
            <sub-filter-activity v-if="mainFilter === 'activity'"></sub-filter-activity>
            <sub-filter-question v-else-if="mainFilter === 'question'"></sub-filter-question>
            <sub-filter-commitment v-else-if="mainFilter === 'commitment'"></sub-filter-commitment>
            <sub-filter-event v-else-if="mainFilter === 'event'"></sub-filter-event>
        </div>
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false"
                               :login-description="$t('pages:feeds.filter.activity.loginDescription')">
        </login-required-dialog>
    </div>
</template>

<script>
    import SubFilterActivity from './subFilter/Activity';
    import SubFilterQuestion from './subFilter/Question';
    import SubFilterCommitment from './subFilter/Commitment';
    import SubFilterEvent from './subFilter/Event';
    import CommonFilterTopic from './commonFilter/SelectTopic';
    import CommonFilterTrustCircle from './commonFilter/TrustCircle';
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired.vue';

    export default {
        components: {
            SubFilterActivity, SubFilterQuestion, SubFilterCommitment, SubFilterEvent,
            CommonFilterTopic, CommonFilterTrustCircle, LoginRequiredDialog
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
                showTrustCircleFilter: false, showLoginRequired: false
            }
        },
        methods: {
            async setFilter(filter) {
                if (!(filter === 'activity' && !this.$store.state.auth.userIsAuthenticated)) {
                    if ((filter !== 'activity' && this.$store.state.auth.userIsAuthenticated) ||
                        (filter !== 'question' && !this.$store.state.auth.userIsAuthenticated)) {
                        this.$router.push({name: filter});
                    } else {
                        this.$router.push({name: 'index'});
                    }
                } else {
                    this.showLoginRequired = true;
                }
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


            .filter-element {
                cursor: pointer;
                font-size: 14px;
                padding: 2px 12px 4px 12px;
                color: $secondary-text;

                i.v-icon {
                    font-size: 20px;
                    margin: 8px;
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

            .right-filter {
                cursor: pointer;
                margin-left: 16px;
                padding: 6px 0 0 0;

                i.v-icon {
                    font-size: 20px;
                }
            }
        }

        #feed-sub-filters {
            padding-top: 12px;
        }
    }
</style>
