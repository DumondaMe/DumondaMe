<template>
    <div id="feed-filter">
        <div class="type-filter-container">
            <div class="filter-element filter-text-element" v-if="!isPublicFeed"
                 :class="{'active-filter': activeTypeFilter === null}" @click="setFilter(null)">
                {{$t("pages:feeds.filter.all")}}
            </div>
            <div class="filter-element" v-if="isPublicFeed"
                 :class="{'active-filter': activeTypeFilter === null}" @click="setFilter(null)">
                <v-icon>mdi-help-circle-outline</v-icon>
            </div>
            <div class="filter-element" v-else
                 :class="{'active-filter': activeTypeFilter === 'question'}" @click="setFilter('question')">
                <v-icon>mdi-help-circle-outline</v-icon>
            </div>
            <div class="filter-element"
                 :class="{'active-filter': activeTypeFilter === 'commitment'}" @click="setFilter('commitment')">
                <v-icon>mdi-human-handsup</v-icon>
            </div>
            <div class="filter-element"
                 :class="{'active-filter': activeTypeFilter === 'event'}" @click="setFilter('event')">
                <v-icon>mdi-calendar</v-icon>
            </div>
            <v-spacer></v-spacer>
            <div class="feed-selector" v-if="isPublicFeed">{{$t("pages:feeds.filter.publicFeed")}}</div>
            <div class="feed-selector" v-else>{{$t("pages:feeds.filter.yourFeed")}}</div>
            <v-menu bottom left>
                <v-btn icon slot="activator" class="feed-icon">
                    <v-icon>mdi-rss</v-icon>
                </v-btn>
                <v-list>
                    <v-list-tile @click="setFeed(false)" v-if="isPublicFeed && isAuthenticated">
                        <v-list-tile-title>{{$t("pages:feeds.filter.yourFeed")}}</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="setFeed(true)" v-if="!isPublicFeed">
                        <v-list-tile-title>{{$t("pages:feeds.filter.publicFeed")}}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </div>
    </div>
</template>

<script>
    export default {
        components: {},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            activeTypeFilter() {
                return this.$store.state.feed.typeFilter;
            },
            isPublicFeed() {
                return this.$store.state.feed.publicFeed
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
            },
            async setFeed(isPublicFeed) {
                this.$store.commit('feed/SET_IS_PUBLIC_FEED', isPublicFeed);
                this.$store.commit('feed/SET_TYPE_FILTER', null);
                this.$router.push({query: null});
                await this.$store.dispatch('feed/getFeed', {isAuthenticated: this.isAuthenticated});
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
                display: inline-block;
                padding: 0 12px 2px 12px;
                color: $secondary-text;
                i.icon {
                    padding-top: 4px;
                    font-size: 18px;
                }
            }
            .filter-element.filter-text-element {
                padding-top: 2px;
            }
            .filter-element.filter-element-first {
                padding-left: 0;
            }
            .filter-element.active-filter {
                color: $primary-color;
                font-weight: 500;
                border-bottom: 3px solid $primary-color;
                i.icon {
                    color: $primary-color;
                }
            }
            .feed-selector {
                height: 30px;
                padding-bottom: 2px;
                line-height: 30px;
                font-size: 16px;
                font-weight: 500;
                margin-right: 4px;
            }
            .feed-icon {
                height: 24px;
                width: 24px;
                padding: 0;
                margin: 0;
                i.icon {
                    padding-top: 2px;
                    font-size: 20px;
                }
                .user-feed {
                    color: $primary-color;
                }
            }
        }
    }
</style>
