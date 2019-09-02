<template>
    <div id="feed-filter">
        <div class="type-filter-container ely-card">
            <v-tooltip top class="filter-element-container">
                <div class="filter-element" slot="activator"
                     :class="{'active-filter': mainFilter === 'activity'}" @click="setFilter('activity')">
                    <v-icon slot="activator" size="24">mdi-heart-pulse</v-icon>
                </div>
                <span v-if="isAuthenticated">{{$t("pages:feeds.filter.tooltip.activity")}}</span>
                <span v-else>{{$t("pages:feeds.filter.tooltip.activityPublic")}}</span>
            </v-tooltip>
            <v-tooltip top class="filter-element-container">
                <div class="filter-element" slot="activator"
                     :class="{'active-filter': mainFilter === 'test'}" @click="setFilter('test')">
                    <v-icon size="24">mdi-newspaper-variant-outline</v-icon>
                </div>
                <span>{{$t("pages:feeds.filter.tooltip.question")}}</span>
            </v-tooltip>
            <v-tooltip top class="filter-element-container">
                <div class="filter-element" slot="activator"
                     :class="{'active-filter': mainFilter === 'question'}" @click="setFilter('question')">
                    <v-icon size="24">mdi-help-circle-outline</v-icon>
                </div>
                <span>{{$t("pages:feeds.filter.tooltip.question")}}</span>
            </v-tooltip>
            <v-tooltip top class="filter-element-container">
                <div class="filter-element" slot="activator"
                     :class="{'active-filter': mainFilter === 'commitment'}" @click="setFilter('commitment')">
                    <v-icon size="24">mdi-human-handsup</v-icon>
                </div>
                <span>{{$t("pages:feeds.filter.tooltip.commitment")}}</span>
            </v-tooltip>
            <v-tooltip top class="filter-element-container">
                <div class="filter-element" slot="activator"
                     :class="{'active-filter': mainFilter === 'event'}" @click="setFilter('event')">
                    <v-icon size="24">mdi-calendar</v-icon>
                </div>
                <span>{{$t("pages:feeds.filter.tooltip.event")}}</span>
            </v-tooltip>
            <v-spacer></v-spacer>
            <!--<v-tooltip top class="right-filter-container" v-if="mainFilter !== 'event'"
                       :class="{'is-public': !isAuthenticated}">
                <div class="right-filter" slot="activator">
                    <common-filter-trust-circle :trust-circle="$store.state.feedFilter.trustCircleFilter"
                                                @trust-circle-changed="trustCircleChanged">
                    </common-filter-trust-circle>
                </div>
                <span>{{$t("pages:feeds.filter.tooltip.trustCircle")}}</span>
            </v-tooltip>-->
            <v-tooltip top class="right-filter-container">
                <div class="right-filter" slot="activator">
                    <common-filter-topic :init-topics="$store.state.feedFilter.topicFilter"
                                         @topic-changed="topicChanged">
                    </common-filter-topic>
                </div>
                <span>{{$t("pages:feeds.filter.tooltip.topic")}}</span>
            </v-tooltip>
        </div>
        <!--<div id="feed-sub-filters">
            <sub-filter-activity v-if="mainFilter === 'activity'"></sub-filter-activity>
            <sub-filter-question v-else-if="mainFilter === 'question'"></sub-filter-question>
            <sub-filter-commitment v-else-if="mainFilter === 'commitment'"></sub-filter-commitment>
            <sub-filter-event v-else-if="mainFilter === 'event'"></sub-filter-event>
        </div>-->
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
        /*position: fixed;
        width: 506px;
        top: 56px;*/
        .type-filter-container {
            /*border-top: none;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            border-left: 2px solid $divider;
            border-bottom: 2px solid $divider;
            border-right: 2px solid $divider;*/
            display: flex;
            .filter-element-container {
                display: inline-block;
                .filter-element {
                    cursor: pointer;
                    font-size: 14px;
                    padding: 4px 12px 0 12px;
                    color: $secondary-text;
                    i.v-icon {
                        font-size: 20px;
                        color: $secondary-text;
                    }
                }
                .filter-element.active-filter {
                    color: $primary-color;
                    font-weight: 500;
                    i.v-icon {
                        color: $primary-color;
                    }
                }
            }
            .filter-element-container.is-public {
                .filter-element {
                    cursor: auto;
                    i.v-icon {
                        color: $disabled-text;
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
