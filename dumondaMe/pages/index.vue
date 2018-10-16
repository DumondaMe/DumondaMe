<template>
    <feed-layout>
        <div slot="sidebar">
            <feed-create-contribution></feed-create-contribution>
            <feed-support v-if="$route.name === 'index' || $route.name === 'event'"></feed-support>
            <feed-commitment-info v-else-if="$route.name === 'commitment'"></feed-commitment-info>
            <feed-activity-info v-else-if="$route.name === 'activity'"></feed-activity-info>
            <!--<feed-popular-question></feed-popular-question>-->
        </div>
        <div slot="content">
            <feed-filter>
            </feed-filter>
            <feed-empty v-if="showHelpFeedInfo">
            </feed-empty>
            <cards v-else :feed="feed" :route-name="$route.name">
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
    import FeedCreateContribution from '~/components/feed/CreateContribution';
    import FeedSupport from '~/components/feed/info/Support';
    import FeedCommitmentInfo from '~/components/feed/info/Commitment';
    import FeedActivityInfo from '~/components/feed/info/Activity';
    import Cards from '~/components/feed/Cards';
    import FeedEmpty from "~/components/feed/FeedEmpty";

    export default {
        async fetch({error, store, route}) {
            try {
                if (route.name === 'index') {
                    store.commit('feedFilter/SET_MAIN_FILTER', 'question');
                } else {
                    store.commit('feedFilter/SET_MAIN_FILTER', route.name);
                }
                await Promise.all([store.dispatch(`feed/getFeed`)/*, store.dispatch(`feed/getPopularQuestion`)*/]);
            } catch (e) {
                error({statusCode: e.statusCode});
            }
        },
        components: {
            FeedLayout, FeedFilter, FeedPopularQuestion, FeedCreateContribution, FeedSupport, FeedCommitmentInfo,
            FeedActivityInfo, Cards, FeedEmpty
        },
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
                return this.$store.state.feed.totalNumberOfElements === 0;
            },
            showLoadNextButton() {
                return this.$store.state.feed.loadingNext && !this.$store.state.feed.loading;
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