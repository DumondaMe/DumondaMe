<template>
    <feed-layout>
        <div slot="sidebar">
            <feed-create-question></feed-create-question>
            <feed-popular-question></feed-popular-question>
        </div>
        <div slot="content">
            <feed-filter>
            </feed-filter>
            <feed-empty v-if="showHelpFeedInfo">
            </feed-empty>
            <cards v-else :feed="feed">
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
    import FeedFilter from '~/components/feed/filter/Filter';
    import FeedPopularQuestion from '~/components/feed/PopularQuestion';
    import FeedCreateQuestion from '~/components/feed/CreateQuestion';
    import Cards from '~/components/feed/Cards';
    import FeedEmpty from "~/components/feed/FeedEmpty";

    export default {
        async fetch({query, app, error, store}) {
            try {
                await Promise.all([store.dispatch(`feed/getFeed`, {
                    isAuthenticated: store.state.auth.userIsAuthenticated,
                })/*, store.dispatch(`feed/getPopularQuestion`)*/]);
            } catch (e) {
                error({statusCode: e.statusCode})
            }
        },
        components: {FeedLayout, FeedFilter, FeedPopularQuestion, FeedCreateQuestion, Cards, FeedEmpty},
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
                return this.$store.state.feed.loadingNext;
            },
            feed() {
                return this.$store.state.feed.feed
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