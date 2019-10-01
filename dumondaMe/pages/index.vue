<template>
    <feed-layout class="index-pages-container">
        <div slot="sidebar">
            <donation-info></donation-info>
            <feed-commitment-info v-if="$route.name === 'commitment'"></feed-commitment-info>
            <feed-activity-info v-else-if="$route.name === 'activity'"></feed-activity-info>
            <networking-info v-if="isAuthenticated && isGerman"></networking-info>
            <concept-info></concept-info>
            <user-suggestions v-if="isAuthenticated"></user-suggestions>
        </div>
        <div slot="content" id="feed-detail-container">
            <donation-info class="mobile-donation-info" v-if="!isLoading"></donation-info>
            <feed-filter></feed-filter>
            <feed-empty v-if="feedEmpty && !isLoading">
            </feed-empty>
            <cards v-else :feed="feed" :route-name="$route.name">
            </cards>
            <v-btn id="load-next-page" color="primary" outlined @click="loadNext()" :loading="loadNextRunning"
                   :disabled="loadNextRunning" v-if="showLoadNextButton">
                {{$t("common:button.showMore")}}
            </v-btn>
            <fab-button :fab-icon="'mdi-plus'" :button-label="$t('common:toolbar.askQuestion')"
                        @show-create-dialog="showCreateQuestionDialog = true"
                        :show-button-breakpoint="1263"></fab-button>
            <create-question-dialog v-if="showCreateQuestionDialog" @close-dialog="showCreateQuestionDialog = false">
            </create-question-dialog>
        </div>
    </feed-layout>
</template>

<script>
    import FeedLayout from '~/components/layouts/Detail';
    import FeedFilter from '~/components/feed/filter/Filter';
    import FeedPopularQuestion from '~/components/feed/PopularQuestion';
    import FeedCommitmentInfo from '~/components/feed/info/Commitment';
    import FeedActivityInfo from '~/components/feed/info/Activity';
    import Cards from '~/components/feed/Cards';
    import FeedEmpty from "~/components/feed/FeedEmpty";
    import UserSuggestions from '~/components/feed/UserSuggestions';
    import AboutDumondaMe from '~/components/feed/AboutDumondaMe';
    import ConceptInfo from '~/components/feed/info/Concept';
    import NetworkingInfo from '~/components/feed/info/Networking';
    import DonationInfo from '~/components/feed/info/Donation';
    import FabButton from '~/components/common/fabButton/Button';
    import CreateQuestionDialog from '~/components/question/dialog/CreateQuestionDialog.vue'

    export default {
        watchQuery: true,
        async fetch({error, store, route}) {
            try {
                if (route.name === 'index' && store.state.auth.userIsAuthenticated) {
                    store.commit('feedFilter/SET_SELECTED_FEED', 'activity');
                } else {
                    store.commit('feedFilter/SET_SELECTED_FEED', route.name);
                }
                await store.dispatch(`feed/getFeed`);
            } catch (e) {
                if (e && e.request && e.request.res && e.request.res.statusCode) {
                    error({statusCode: e.request.res.statusCode});
                } else if (e.message === 'Network Error') {
                    error({statusCode: 600});
                }
            }
            store.commit('toolbar/HIDE_BACK_BUTTON');
        },
        components: {
            FeedLayout, FeedFilter, FeedPopularQuestion,
            FeedCommitmentInfo, FeedActivityInfo, Cards, FeedEmpty, UserSuggestions, AboutDumondaMe,
            ConceptInfo, NetworkingInfo, DonationInfo, FabButton, CreateQuestionDialog
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
            return {loadNextRunning: false, showCreateQuestionDialog: false}
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            feedEmpty() {
                return this.$store.state.feed.feedIsEmpty;
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
            },
            filterIsActive() {
                return this.$store.state.feedFilter.filterActive
            }
        },
        methods: {
            async loadNext() {
                try {
                    this.loadNextRunning = true;
                    await this.$store.dispatch(`feed/loadNextFeedElements`,
                        {isAuthenticated: this.$store.state.auth.userIsAuthenticated});
                    this.loadNextRunning = false;
                } catch (error) {
                    this.loadNextRunning = false;
                }
            }
        },
        watch: {
            async filterIsActive() {
                await this.$store.dispatch(`feed/getFeed`);
            }
        }
    }
</script>

<style lang="scss">
    .index-pages-container {

        padding-top: 32px;
        padding-bottom: 64px;
        @media screen and (max-width: $lg) {
            padding-top: 56px;
            padding-bottom: 18px;
        }

        #feed-detail-container {

            #load-next-page {
                margin-left: 0;
            }

            .mobile-feed-filter {
                @media screen and (min-width: $lg) {
                    display: none;
                }
            }

            .mobile-donation-info {
                @media screen and (min-width: $xs + 1) {
                    display: none;
                }
            }
        }
    }
</style>