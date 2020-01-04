<template>
    <detail-layout class="commitment-layout">
        <div slot="content" id="commitment-detail">
            <div class="user-mobile-content">
                <profile-image></profile-image>
            </div>
            <commitment-header>
            </commitment-header>
            <div class="user-mobile-content">
                <general-information></general-information>
                <contributors></contributors>
            </div>
            <notifications>
            </notifications>
            <questions>
            </questions>
            <events>
            </events>
        </div>
        <div slot="sidebar" id="commitment-sidebar">
            <profile-image></profile-image>
            <general-information></general-information>
            <contributors></contributors>
        </div>
    </detail-layout>
</template>

<script>
    import DetailLayout from '~/components/layouts/Detail';
    import CommitmentHeader from '~/components/commitment/detail/Header';
    import ProfileImage from '~/components/commitment/detail/ProfileImage';
    import Notifications from '~/components/commitment/detail/notifications/Notifications';
    import Questions from '~/components/commitment/detail/Questions';
    import Events from '~/components/commitment/detail/event/Events';
    import GeneralInformation from '~/components/commitment/detail/GeneralInformation';
    import Contributors from '~/components/commitment/detail/contributors/Contributors';
    import {mapGetters} from 'vuex';

    export default {
        async fetch({params, store, error}) {
            try {
                await store.dispatch(`commitment/getCommitment`, params.commitmentId);
            } catch (e) {
                if (e && e.request && e.request.res && e.request.res.statusCode) {
                    error({statusCode: e.request.res.statusCode});
                } else {
                    error();
                }
            }
            store.commit('toolbar/SHOW_BACK_BUTTON');
        },
        head() {
            let description = '';
            if (this.commitment && this.commitment.description) {
                description = this.commitment.description.substring(0, 150);
                if (this.commitment.description.length > 150) {
                    description += '...';
                }
            }
            return {
                title: this.commitment.title,
                htmlAttrs: {
                    lang: this.commitment.lang
                },
                meta: [
                    {hid: 'description', name: 'description', content: description},
                    {hid: 'og:title', name: 'og:title', content: this.commitment.title},
                    {hid: 'og:description', name: 'og:description', content: description},
                    {hid: 'og:url', name: 'og:url', content: `https://dumonda.me${this.$route.path}`},
                    {hid: 'twitter:title', name: 'twitter:title', content: this.commitment.title},
                    {hid: 'twitter:description', name: 'twitter:description', content: description}
                ]
            }
        },
        components: {
            DetailLayout, CommitmentHeader, ProfileImage, Notifications, Questions, Events, GeneralInformation,
            Contributors
        },
        computed: {
            ...mapGetters({commitment: 'commitment/getCommitment'})
        }
    }
</script>

<style lang="scss">
    .commitment-layout {
        padding-top: 18px;

        #commitment-detail {
            margin-bottom: 48px;

            h2 {
                font-size: 16px;
                font-weight: 400;
                margin-top: 32px;
                margin-bottom: 12px;
                border-bottom: 1px solid $divider;
            }

            .user-mobile-content {
                @media screen and (min-width: $xs) {
                    display: none;
                }
            }
        }

        #commitment-sidebar {
            width: 100%;

            .sidebar-container {
                width: 100%;
                margin-top: 32px;

                h3 {
                    font-size: 16px;
                    border-bottom: 1px solid #ddd;
                    margin-bottom: 12px;
                }
            }
        }
    }
</style>
