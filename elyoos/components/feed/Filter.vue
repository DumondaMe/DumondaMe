<template>
    <div id="feed-filter">
        <div class="type-filter-container" v-if="isPublicFeed">
            <div class="filter-element"
                 :class="{'active-filter': activeTypeFilter === null}" @click="setFilter(null)">
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
            <div class="feed-selector">Public Feed</div>
            <v-icon class="feed-icon">mdi-rss</v-icon>
        </div>
        <div class="type-filter-container" v-else>

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
            }
            .filter-element.filter-element-first {
                padding-left: 0;
            }
            .filter-element.active-filter {
                border-bottom: 3px solid $primary-color;
                i.icon {
                    color: $primary-color;
                }
            }
            .feed-selector {
                font-size: 16px;
                font-weight: 500;
                margin-right: 8px;
                line-height: 28px;
            }
            .feed-icon {
                padding-bottom: 4px;
            }
        }
    }
</style>
