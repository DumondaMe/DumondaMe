<template>
    <feed-layout>
        <div slot="sidebar">
            <feed-create-contribution></feed-create-contribution>
            <beta-version></beta-version>
            <feed-support v-if="$route.name === 'index' || $route.name === 'event'"></feed-support>
            <feed-commitment-info v-else-if="$route.name === 'commitment'"></feed-commitment-info>
            <feed-activity-info v-else-if="$route.name === 'activity'"></feed-activity-info>
            <networking-info v-if="isAuthenticated && isGerman"></networking-info>
            <concept-info></concept-info>
            <user-suggestions v-if="isAuthenticated"></user-suggestions>
        </div>
        <div slot="content" id="feed-detail-container">
            <feed-filter class="index-desktop-feed-filter">
            </feed-filter>
            <div class="news-card-container">
                <div class="feed-card news-card ely-card">
                    <div class="feed-card-header">
                        <div>
                            <h2 class="feed-card-title">
                                <span class="answer-type">News </span><span class="card-header-link">
                        <nuxt-link :to="{name: 'question-questionId-slug',
                            params: {questionId: '', slug: ''},
                            query: {answerId: 1}}"> Greta Thunberg am Klimagipfel in Lausanne
                        </nuxt-link></span>

                            </h2>
                            <div class="secondary-text">
                                vor 2 Stunden
                            </div>
                        </div>
                        <v-spacer></v-spacer>
                        <slot name="feedMenu"></slot>
                    </div>
                    <div class="news-content">
                        <img src="https://www.srf.ch/static/cms/images/branded_srf_news/ee93f2.jpg"/>
                        <div class="description">
                            Zusammen mit 450 jungen Menschen aus ganz Europa will die Schwedin künftige
                            Klimaschutz-Aktionen besser koordinieren.
                        </div>
                    </div>
                    <div class="news-footer card-footer-feed">
                        <div class="footer-icon">
                            <div class="user-icon">
                                <img src="https://www.srf.ch/extension/srf_shared/design/standard/images/favicons/favicon-64x64.png"/>
                            </div>
                        </div>
                        <div class="news-icon-container">
                            <v-icon color="primary">mdi-thumb-up-outline</v-icon>
                            <span class="number">41</span>
                        </div>
                        <div class="news-icon-container">
                            <v-icon color="primary">mdi-chat-outline</v-icon>
                            <span class="number">3</span>
                        </div>
                        <div class="news-icon-container">
                            <v-icon color="primary">mdi-help-circle-outline</v-icon>
                            <span class="number">1</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </feed-layout>
</template>

<script>
    import FeedLayout from '~/components/layouts/Feed';
    import FeedFilter from '~/components/feed/filter/Filter';
    import FeedMobileFilter from '~/components/feed/filter/MobileFilter';
    import FeedPopularQuestion from '~/components/feed/PopularQuestion';
    import FeedCreateContribution from '~/components/feed/CreateContribution';
    import FeedSupport from '~/components/feed/info/Support';
    import FeedCommitmentInfo from '~/components/feed/info/Commitment';
    import FeedActivityInfo from '~/components/feed/info/Activity';
    import Cards from '~/components/feed/Cards';
    import FeedEmpty from "~/components/feed/FeedEmpty";
    import BetaVersion from "~/components/common/beta/BetaDescription";
    import UserSuggestions from '~/components/feed/UserSuggestions';
    import AboutDumondaMe from '~/components/feed/AboutDumondaMe';
    import ConceptInfo from '~/components/feed/info/Concept';
    import NetworkingInfo from '~/components/feed/info/Networking';

    export default {
        async fetch({error, store, route}) {
            try {
                if (!(route.name === 'index' && !store.state.auth.userIsAuthenticated)) {
                    if (route.name === 'index' && store.state.auth.userIsAuthenticated) {
                        store.commit('feedFilter/SET_MAIN_FILTER', 'activity');
                    } else {
                        store.commit('feedFilter/SET_MAIN_FILTER', route.name);
                    }

                    //await Promise.all([store.dispatch(`feed/getFeed`)]);
                }
            } catch (e) {
                error({statusCode: e.request.res.statusCode});
            }
        },
        components: {
            FeedLayout, FeedFilter, FeedMobileFilter, FeedPopularQuestion, FeedCreateContribution, FeedSupport,
            FeedCommitmentInfo, FeedActivityInfo, Cards, FeedEmpty, BetaVersion, UserSuggestions, AboutDumondaMe,
            ConceptInfo, NetworkingInfo
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
        methods: {}
    }
</script>

<style lang="scss">
    .news-card-container {
        margin-top: 68px;

        .news-card {
            .news-content {
                img {
                    width: 100%;
                }

                .description {
                    font-weight: 300;
                }
            }

            .news-footer {
                margin-top: 12px;
                display: flex;

                .footer-icon {
                    margin-right: 18px;
                }

                .news-icon-container {
                    padding-top: 8px;

                    .number {
                        padding-left: 4px;
                        padding-right: 24px;
                        font-weight: 500;
                        color: $secondary-text;
                    }
                }
            }
        }
    }

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