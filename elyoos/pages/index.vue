<template>
    <feed-layout>
        <div slot="sidebar">

        </div>
        <div slot="content">
            <feed-filter>
            </feed-filter>
            <feed-help v-if="showHelpFeedInfo">
            </feed-help>
            <cards v-else>
            </cards>
            <v-btn id="load-next-page" color="primary" outline @click="loadNext()" :loading="loadNextRunning"
                   :disabled="loadNextRunning" v-if="showLoadNextButton">
                {{$t("common:button.showMore")}}
            </v-btn>
        </div>
    </feed-layout>
</template>

<script>
    import FeedLayout from '~/components/layouts/Feed';
    import FeedFilter from '~/components/feed/Filter';
    import Cards from '~/components/feed/Cards';
    import FeedHelp from "~/components/feed/FeedHelp";

    export default {
        async fetch({query, app, error, store}) {
            try {
                if (query.typeFilter) {
                    store.commit(`feed/SET_TYPE_FILTER`, query.typeFilter);
                } else {
                    store.commit(`feed/SET_TYPE_FILTER`, null);
                }
                await store.dispatch(`feed/getFeed`, {
                    isAuthenticated: store.state.auth.userIsAuthenticated,
                    typeFilter: query.typeFilter
                });
            } catch (e) {
                error({statusCode: e.statusCode})
            }
        },
        components: {FeedLayout, FeedFilter, Cards, FeedHelp},
        head() {
            return {
                htmlAttrs: {
                    lang: this.$store.state.i18n.language
                },
            }
        },
        data() {
            return {loadNextRunning: false}
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            showHelpFeedInfo() {
                return this.$store.state.feed.totalNumberOfElements === 0 && !this.$store.state.feed.publicFeed;
            },
            showLoadNextButton() {
                return this.$store.state.feed.totalNumberOfElements >
                    this.$store.state.feed.feed.length;
            }
        },
        methods: {
            async loadNext() {
                try {
                    this.loadNextRunning = true;
                    await this.$store.dispatch(`feed/loadNextFeedElements`,
                        {isAuthenticated: this.$store.state.auth.userIsAuthenticated});
                    this.loadNextRunning = false;
                }
                catch (error) {
                    this.loadNextRunning = false;
                }
            }
        }
    }
</script>

<style lang="scss">
    #load-next-page {
        margin-left: 0;
    }
</style>