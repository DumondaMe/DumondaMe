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
                                <span class="answer-type">Newsworthy </span><span class="card-header-link">
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
                <div class="news-card">
                    <div class="feed-card ely-card">
                        <div class="activity-feed-action">
                            <span class="name">Alice Freigeist</span> applaudiert dieser Antwort
                        </div>
                        <div class="feed-card-header">
                            <div>
                                <h2 class="feed-card-title">
                                    <span class="answer-type">Video </span><span class="card-header-link">
                        <nuxt-link :to="{name: 'question-questionId-slug',
                            params: {questionId: '', slug: ''},
                            query: {answerId: 1}}"> Gedanken zu nachhaltigem Wohnen von Kim Jana
                        </nuxt-link></span> <span class="answer-type"> beantwortet die Frage </span>
                                    <span class="card-header-link"><nuxt-link :to="{name: 'question-questionId-slug',
                            params: {questionId: '2', slug: ''},
                            query: {answerId: 1}}"> Welche Wohnformen sind zukunftsfähig?
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
                            <img src="https://img.youtube.com/vi/1ON15D0ANkc/0.jpg"/>
                            <div class="description">
                                Kim hat bereits einige Erfahrung mit nachhaltigem Wohnen gemacht und teilt diese mit dir
                                in diesem Video.
                            </div>
                        </div>
                        <div class="news-footer card-footer-feed">
                            <!--<div class="footer-icon">
                                <div class="user-icon">
                                    <img src="https://s3.eu-central-1.amazonaws.com/dumonda.me.private/profileImage/0/thumbnail.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA23P7ZLZ3ZDFN6HLS%2F20190827%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20190827T150510Z&X-Amz-Expires=43200&X-Amz-Security-Token=AgoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDGV1LWNlbnRyYWwtMSJHMEUCIGz7PZjWYSgWK%2BfSBD1bFa%2Fef8XtIgphhY0KOrfYmJlQAiEAkPWU553Tn%2B7bKa9k3j0jkJqPwJsUS5RXd2WfU%2BlI1XQq4AMIXBAAGgw3NDYyNTAxMzMxMTEiDDfXbHNC%2FFlQiZ7fkCq9Ax5q2XNV3yiCqpqEwxO2XyLeXRjcxXpTKsp4kShbDA1fup8GbcwR%2B2M12YhxGP5R7A1kdMuX3c1c0hW6JHuk%2BzGKr%2B8TbhxHzBvlx1QFkvyC3N4nUy823xSTIxA9TsyCC%2BGcLi04moRz1EZNjxZHGe9KU1RO2MqYq%2FGWNjkXzQOi1gDcq2hSaExCJWK%2B25Y56Tl0anbFTVVzjfHMWzHfouqWmTuHdXx4lb5ev1hct2kG4PKZ43IlcBnvj0Hh%2BznSBuH5%2FWQ7z1h15aMaZaIaeuc8BETdU2SKGQ9pHVlClGE2Vcwwc4CSZLvN4L24G1iT%2F2CRhulzbYqeIXVx7nOWWabNyHcS8I9HsTj1ZVCy9OZMWdHTb3NzegnkyVzgEvP43Xnr2ktA4YJ1%2Fm9eCGR250%2Bfs8IZbqWwNoAIEzc9usNbBVgmItSpE5b1QhHPjhejFkhB%2Bwv7lhgN9gk5s4Cnfbn04gz0fh4iWntVv%2F2ZRgUF0hWXEmx11TCnRVNqM0B5DjgUaZ66ND03PDVfZ8d4i9V3BOrtKxBNvYRXlBrbYxJI8j7Gn2XrSa%2FMDKgYjCcqeJp3GDA5I47%2FEtkX2rYw%2BJqU6wU6tAFX0pRiGfzm%2FXELKXwFeNgoa3Cjt%2FOKOSM6nZoAGqZg%2BkEeggI%2BJ3odQ4NHk%2FgpBp6TduhSM1P1qbNXO6OTKpT6xygeogr%2F3CpAf3IUw%2FJkEF39xm6pkkovdY7GSCg37M9fDg5upScDLGfnxENneSpEuPqAHaesvKvmp9Xvmu%2BxqJasKka%2FZX%2BSmWflqk7xlhUAKlbAMrEyV6Q3UtgqN95fWbysZVpbnM52J8xK2Z5AUtX%2FNr8%3D&X-Amz-Signature=1a15e23d2b078f1daae619f0ec17e712836fcabed86d0753599b2aded2d11a19&X-Amz-SignedHeaders=host"/>
                                </div>
                            </div>-->
                            <div class="news-icon-container">
                                <v-icon color="primary">mdi-thumb-up-outline</v-icon>
                                <span class="number">41</span>
                            </div>
                            <div class="news-icon-container">
                                <v-icon color="primary">mdi-chat-outline</v-icon>
                                <span class="number">3</span>
                            </div>
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
        margin-top: 18px;

        .news-card {
            .activity-feed-action {
                margin-right: -22px;
                margin-left: -22px;
                margin-top: -6px;
                padding-left: 22px;
                padding-right: 22px;
                padding-bottom: 8px;
                margin-bottom: 16px;
                border-bottom: 1px solid $divider;
                font-size: 12px;
                color: $secondary-text;

                .name {
                    font-weight: 500;
                    color: $primary-text;
                }
            }

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