<template>
    <feed-layout>
        <div slot="sidebar">
            <donation-info></donation-info>
            <feed-commitment-info v-if="$route.name === 'commitment'"></feed-commitment-info>
            <feed-activity-info v-else-if="$route.name === 'activity'"></feed-activity-info>
            <networking-info v-if="isAuthenticated && isGerman"></networking-info>
            <concept-info></concept-info>
            <user-suggestions v-if="isAuthenticated"></user-suggestions>
        </div>
        <div slot="content" id="feed-detail-container">
            <feed-mobile-filter class="index-mobile-feed-filter">
            </feed-mobile-filter>
            <about-dumonda-me v-if="!isAuthenticated" v-show="$route.name === 'index' && !isLoading"></about-dumonda-me>
            <donation-info class="index-mobile-feed-filter"></donation-info>
            <feed-empty v-if="showHelpFeedInfo">
            </feed-empty>
            <cards v-else :feed="feed" :route-name="$route.name">
            </cards>
            <v-btn id="load-next-page" color="primary" outlined @click="loadNext()" :loading="loadNextRunning"
                   :disabled="loadNextRunning" v-if="showLoadNextButton">
                {{$t("common:button.showMore")}}
            </v-btn>
        </div>
    </feed-layout>
</template>

<script>
    import FeedLayout from '~/components/layouts/Feed';
    import FeedFilter from '~/components/feed/filter/Filter';
    import FeedMobileFilter from '~/components/feed/filter/MobileFilter';
    import FeedPopularQuestion from '~/components/feed/PopularQuestion';
    import FeedCreateContribution from '~/components/feed/CreateContribution';
    import FeedCommitmentInfo from '~/components/feed/info/Commitment';
    import FeedActivityInfo from '~/components/feed/info/Activity';
    import Cards from '~/components/feed/Cards';
    import FeedEmpty from "~/components/feed/FeedEmpty";
    import UserSuggestions from '~/components/feed/UserSuggestions';
    import AboutDumondaMe from '~/components/feed/AboutDumondaMe';
    import ConceptInfo from '~/components/feed/info/Concept';
    import NetworkingInfo from '~/components/feed/info/Networking';
    import DonationInfo from '~/components/feed/info/Donation';

    export default {
        async fetch({error, store, route}) {
            try {
                if (!(route.name === 'index' && !store.state.auth.userIsAuthenticated)) {
                    if (route.name === 'index' && store.state.auth.userIsAuthenticated) {
                        store.commit('feedFilter/SET_MAIN_FILTER', 'activity');
                    } else {
                        store.commit('feedFilter/SET_MAIN_FILTER', route.name);
                    }

                    await Promise.all([store.dispatch(`feed/getFeed`)]);
                }
            } catch (e) {
                error({statusCode: e.request.res.statusCode});
            }
        },
        components: {
            FeedLayout, FeedFilter, FeedMobileFilter, FeedPopularQuestion, FeedCreateContribution,
            FeedCommitmentInfo, FeedActivityInfo, Cards, FeedEmpty, UserSuggestions, AboutDumondaMe,
            ConceptInfo, NetworkingInfo, DonationInfo
        },
        head() {
            return {
                htmlAttrs: {
                    lang: this.$store.state.i18n.language
                },
                meta: [
                    {hid: 'description', name: 'description', content: this.$t('common:meta.description')},
                    {hid: 'keywords', name: 'keywords', content: this.$t('common:meta.keywords')},
                    {hid: 'og:description', property: 'og:description', content: this.$t('common:meta.description')},
                    {hid: 'og:title', property: 'og:title', content: this.$t('common:navigation.home')},
                    {
                        hid: 'twitter:description', property: 'twitter:description',
                        content: this.$t('common:meta.description')
                    },
                    {hid: 'twitter:title', property: 'twitter:title', content: this.$t('common:navigation.home')}
                ]
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
            isLoading() {
                return this.$store.state.feed.loading;
            },
            feed() {
                return this.$store.state.feed.feed
            },
            isGerman() {
                return this.$store.state.i18n.language === 'de';
            }
        },
        methods: {
            async loadNext() {
                try {
                    this.loadNextRunning = true;
                    await
                        this.$store.dispatch(`feed/loadNextFeedElements`,
                            {isAuthenticated: this.$store.state.auth.userIsAuthenticated});
                    this.loadNextRunning = false;
                } catch (error) {
                    this.loadNextRunning = false;
                }
            }
        }
    }
</script>

<style lang="scss">
    #feed-detail-container {
        #load-next-page {
            margin-left: 0;
        }

        .index-desktop-feed-filter {
            @media screen and (max-width: $xs) {
                display: none;
            }
        }

        .index-mobile-feed-filter {
            @media screen and (min-width: $xs) {
                display: none;
            }
        }

        .index-mobile-feed-filter.top-feed-element {
            margin-top: 56px;
        }
    }
</style>